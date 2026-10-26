package dev.oasfuse.cli;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import dev.oasfuse.core.application.ComparisonOptions;
import dev.oasfuse.core.application.SpecificationSource;
import dev.oasfuse.core.comparison.ComparisonEngine;
import dev.oasfuse.core.domain.ComparisonReport;
import dev.oasfuse.core.domain.Finding;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.Callable;
import picocli.CommandLine;

@CommandLine.Command(
    name = "oasfuse",
    version = "OASFuse 0.1.0",
    mixinStandardHelpOptions = true,
    subcommands = OasFuseCli.Compare.class)
public final class OasFuseCli implements Runnable {
  public static void main(String[] args) {
    System.exit(new CommandLine(new OasFuseCli()).execute(args));
  }

  @Override
  public void run() {
    CommandLine.usage(this, System.out);
  }

  @CommandLine.Command(
      name = "compare",
      description = "Compare two local OpenAPI specifications.",
      mixinStandardHelpOptions = true)
  static final class Compare implements Callable<Integer> {
    @CommandLine.Option(
        names = {"-b", "--baseline"},
        required = true)
    Path baseline;

    @CommandLine.Option(
        names = {"-c", "--candidate"},
        required = true)
    Path candidate;

    @CommandLine.Option(names = "--format", defaultValue = "text")
    Format format;

    @CommandLine.Option(names = "--output")
    Path output;

    @CommandLine.Option(names = "--fail-on", defaultValue = "breaking")
    FailOn failOn;

    @Override
    public Integer call() {
      try {
        ComparisonReport report =
            new ComparisonEngine()
                .compare(
                    new SpecificationSource(
                        baseline.getFileName().toString(),
                        Files.readString(baseline, StandardCharsets.UTF_8)),
                    new SpecificationSource(
                        candidate.getFileName().toString(),
                        Files.readString(candidate, StandardCharsets.UTF_8)),
                    new ComparisonOptions(failOn.value, List.of()));
        String rendered = render(report, format);
        if (output == null) System.out.println(rendered);
        else Files.writeString(output, rendered, StandardCharsets.UTF_8);
        return report.summary().shouldFail() ? 1 : 0;
      } catch (Exception exception) {
        System.err.println("OASFuse comparison failed: " + exception.getMessage());
        return 2;
      }
    }
  }

  enum Format {
    text,
    json,
    markdown
  }

  enum FailOn {
    breaking("breaking"),
    review("review"),
    never("never");
    final String value;

    FailOn(String value) {
      this.value = value;
    }
  }

  static String render(ComparisonReport report, Format format) throws Exception {
    if (format == Format.json)
      return new ObjectMapper()
          .enable(SerializationFeature.INDENT_OUTPUT)
          .writeValueAsString(report);
    StringBuilder result =
        new StringBuilder(
            format == Format.markdown
                ? "# OASFuse comparison report\n\n"
                : "OASFuse comparison report\n\n");
    result
        .append("Findings: ")
        .append(report.summary().total())
        .append(" (breaking: ")
        .append(report.summary().countsBySeverity().get("breaking"))
        .append(", review: ")
        .append(report.summary().countsBySeverity().get("review"))
        .append(")\n");
    for (Finding finding : report.findings()) {
      if (format == Format.markdown)
        result
            .append("\n## ")
            .append(finding.title())
            .append("\n\n- Severity: ")
            .append(finding.severity())
            .append("\n- Rule: `")
            .append(finding.ruleId())
            .append("`\n- Location: `")
            .append(finding.location())
            .append("`\n\n")
            .append(finding.message())
            .append("\n");
      else
        result
            .append("\n[")
            .append(finding.severity())
            .append("] ")
            .append(finding.ruleId())
            .append(" ")
            .append(finding.location())
            .append(" - ")
            .append(finding.message())
            .append("\n");
    }
    return result.toString();
  }
}
