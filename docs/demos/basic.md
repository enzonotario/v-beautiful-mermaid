# Basic Demos

These demos are adapted from the `beautiful-mermaid` samples to demonstrate the variety of diagrams supported.


## Simple Flowchart

A basic top-down flowchart.

```mermaid-svg
graph TD
  A[Start] --> B[Process] --> C[End]
```

```mermaid-ascii
graph TD
  A[Start] --> B[Process] --> C[End]
```

## XY Charts

Modern bar and line charts.

### r Chart

```mermaid-svg
xychart-beta
    title "Product Sales"
    x-axis [Widgets, Gadgets, Gizmos, Doodads, Thingamajigs]
    bar [150, 230, 180, 95, 310]
```

```mermaid-ascii
xychart-beta
    title "Product Sales"
    x-axis [Widgets, Gadgets, Gizmos, Doodads, Thingamajigs]
    bar [150, 230, 180, 95, 310]
```

### xed Line & Bar Chart

```mermaid-svg
xychart-beta
    title "Monthly Revenue"
    x-axis "Month" [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Revenue (USD)" 0 --> 10000
    bar [4200, 5000, 5800, 6200, 5500, 7000, 7800, 7200, 8400, 8100, 9000, 9200]
    line [4200, 5000, 5800, 6200, 5500, 7000, 7800, 7200, 8400, 8100, 9000, 9200]
```

```mermaid-ascii
xychart-beta
    title "Monthly Revenue"
    x-axis "Month" [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Revenue (USD)" 0 --> 10000
    bar [4200, 5000, 5800, 6200, 5500, 7000, 7800, 7200, 8400, 8100, 9000, 9200]
    line [4200, 5000, 5800, 6200, 5500, 7000, 7800, 7200, 8400, 8100, 9000, 9200]
```

## Sequence Interaction

A sequence diagram with actor stick figures and aliases.

```mermaid-svg
sequenceDiagram
  actor U as User
  participant S as System
  participant DB as Database
  U->>S: Click button
  S->>DB: Query
  DB-->>S: Results
  S-->>U: Display
```

```mermaid-ascii
sequenceDiagram
  actor U as User
  participant S as System
  participant DB as Database
  U->>S: Click button
  S->>DB: Query
  DB-->>S: Results
  S-->>U: Display
```

## Class Structure

A simple class definition with visibility markers.

```mermaid-svg
classDiagram
  class Animal {
    +String name
    +int age
    +eat() void
    +sleep() void
  }
```

```mermaid-ascii
classDiagram
  class Animal {
    +String name
    +int age
    +eat() void
    +sleep() void
  }
```

## Entity Relationship

A basic relationship between two entities.

```mermaid-svg
erDiagram
  CUSTOMER ||--o{ ORDER : places
```

```mermaid-ascii
erDiagram
  CUSTOMER ||--o{ ORDER : places
```

## System Architecture

A more complex architecture using subgraphs and different node shapes.

```mermaid-svg
graph LR
  subgraph clients [Client Layer]
    A([Web App]) --> B[API Gateway]
    C([Mobile App]) --> B
  end
  subgraph services [Service Layer]
    B --> D[Auth Service]
    B --> E[User Service]
    B --> F[Order Service]
  end
  subgraph data [Data Layer]
    D --> G[(Auth DB)]
    E --> H[(User DB)]
    F --> I[(Order DB)]
    F --> J([Message Queue])
  end
```

```mermaid-ascii
graph LR
  subgraph clients [Client Layer]
    A([Web App]) --> B[API Gateway]
    C([Mobile App]) --> B
  end
  subgraph services [Service Layer]
    B --> D[Auth Service]
    B --> E[User Service]
    B --> F[Order Service]
  end
  subgraph data [Data Layer]
    D --> G[(Auth DB)]
    E --> H[(User DB)]
    F --> I[(Order DB)]
    F --> J([Message Queue])
  end
```
