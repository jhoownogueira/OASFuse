export const baselineExample = `openapi: 3.0.3
info:
  title: Users API
  version: 1.0.0
paths:
  /users:
    get:
      operationId: listUsers
      responses:
        "200":
          description: User list
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/User"
components:
  schemas:
    User:
      type: object
      required: [id, email]
      properties:
        id:
          type: integer
        email:
          type: string`;

export const candidateExample = `openapi: 3.0.3
info:
  title: Users API
  version: 1.1.0
paths:
  /users:
    get:
      operationId: getUsers
      responses:
        "200":
          description: User list
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/User"
  /health:
    get:
      responses:
        "200":
          description: Service health
components:
  schemas:
    User:
      type: object
      required: [id]
      properties:
        id:
          type: string`;
