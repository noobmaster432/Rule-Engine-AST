# Rule Engine with Abstract Syntax Tree (AST)

## Overview

This project implements a simple 3-tier Rule Engine application that determines user eligibility based on various attributes like age, department, income, and spending. The application uses an Abstract Syntax Tree (AST) to represent conditional rules and allows for dynamic creation, combination, and modification of these rules.

![rule-engine-ast-mu vercel app_](https://github.com/user-attachments/assets/cff17499-ee21-4c9b-8e39-0db802c19fe7)

## Features

- **Dynamic Rule Creation**: Create complex rules using a simple string syntax.
- **Rule Combination**: Combine multiple rules into a single AST.
- **Evaluation**: Evaluate the combined rules against user data to determine eligibility.
- **Simple UI**: An intuitive front-end interface for users to interact with the rule engine.
- **API Support**: RESTful API endpoints for rule management and evaluation.
- **MongoDB Integration**: Store rules and metadata using MongoDB.

## Data Structure

### Node Structure

The AST is represented using a `Node` structure with the following fields:

- `type`: String indicating the node type ("operator" for AND/OR, "operand" for conditions).
- `left`: Reference to another Node (left child).
- `right`: Reference to another Node (right child for operators).
- `value`: Optional value for operand nodes (e.g., number for comparisons).

### Example Node

```javascript
{
  type: "operator",
  value: "AND",
  left: {
    type: "operand",
    value: {
      attribute: "age",
      condition: ">",
      threshold: 30
    }
  },
  right: null
}
```

## Data Storage

### Database Choice

This application uses **MongoDB** for storing rules and application metadata.

### Sample Rules

- **Rule 1**: 
  ```plaintext
  ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) 
  AND (salary > 50000 OR experience > 5)
  ```

- **Rule 2**: 
  ```plaintext
  ((age > 30 AND department = 'Marketing')) 
  AND (salary > 20000 OR experience > 5)
  ```

### Sample Data
```json
{
  "_id": {
    "$oid": "671342f337fcb033a210920d"
  },
  "name": "Rule 1",
  "ast": {
    "type": "operator",
    "value": "AND",
    "left": {
      "type": "operand",
      "value": "age > 30"
    },
    "right": {
      "type": "operand",
      "value": "department = 'Sales'"
    }
  }
}
```

## API Design

### 1. Create Rule

**Endpoint**: `POST /api/createRule`

**Request Body**:
```json
{
  "name": "Rule 1",
  "rule_string": "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "name": "Rule 1",
    "ast": {
      "type": "operator",
      "value": "AND",
      "left": {
        "type": "operand",
        "value": "age > 30"
      },
      "right": {
        "type": "operand",
        "value": "department = 'Sales'"
      }
    }
  }
}
```

### 2. Combine Rules

**Endpoint**: `POST /api/combineRules`

**Request Body**:
```json
{
  "ruleIds": [
    "671342f337fcb033a210920d",
    "6713432e37fcb033a210920e"
  ]
}
```

**Response**:
```json
{
  "success": true,
  "combinedAST": {
    "name": "Combined Rule 58",
    "ast": {
      "type": "operator",
      "value": "AND",
      "left": {
        "type": "operator",
        "value": "AND",
        "left": {
          "type": "operand",
          "value": "age > 30"
        },
        "right": {
          "type": "operand",
          "value": "department = 'Sales'"
        }
      },
      "right": {
         "type": "operator",
         "value": "AND",
         "left": {
           "type": "operand",
           "value": "age < 25"
          },
         "right": {
            "type": "operand",
            "value": "department = 'Marketing'"
          }
      }
    }
  }
}
```

### 3. Evaluate Rule

**Endpoint**: `POST /api/evaluateRule`

**Request Body**:
```json
{
  "ast": { /* Combined AST Object */ },
  "data": {
    "age": 35,
    "department": "Sales",
    "salary": 60000,
    "experience": 3
  }
}
```

**Response**:
```json
{
  "success": true,
  "result": true
}
```

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/noobmaster432/Rule-Engine-AST.git
   cd Rule-Engine-AST
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   PORT=your_preferred_port(3000)
   NODE_ENV=developmet
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```
   The application will be running on `http://localhost:3000`.

## Usage

- Access the UI by navigating to `http://localhost:3000` in your browser.
- Use the API endpoints to create, combine, and evaluate rules programmatically.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
