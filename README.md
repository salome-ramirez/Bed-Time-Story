# Bed Time Story
**An insight into sleep deprivation across the American lifespan.**

[**View the Live Project Here**](https://salome-ramirez.github.io/Bed-Time-Story/)

## Overview
Bed Time Story is a five-chapter scrollytelling data essay created for JMM 629. It examines exactly how much sleep Americans get and the toll chronic deprivation takes on their bodies and minds from age six to eighty-five. 

The project uses a custom "celestial" visual metaphor to translate abstract public health statistics into a human-scale narrative. The piece walks through five distinct life stages (Children, Teenagers, Young Adults, Adults, and Seniors) and concludes with an interactive lifespan curve that allows readers to calculate their own cumulative sleep deficit.

## Visualizations
The visual language of the project relies entirely on custom D3.js layouts rather than standard out-of-the-box charts. Key visualizations include:
* **The Orbit Chart:** A recurring motif that plots each person as a star, mapping their sleep deficit to their radial distance from a central moon.
* **Quadrant Charts:** Used to split populations by coping mechanisms (like caffeine and screen time) to show correlations with anxiety.
* **Slope Charts:** Used to illustrate unanimous physical decline across multiple health metrics simultaneously.
* **Hexbin Maps:** Used to aggregate massive data points (like morning cortisol levels versus social jet lag) into readable density gradients.
* **Interactive Deficit Calculator:** A dynamic final chart that allows users to find their exact age on a lifespan curve and estimate the sleep they have been owed since childhood.

## Data & Methodology
The data driving the visualizations consists of roughly 7,500 simulated lives. These distributions were carefully calibrated to match published findings and peer-reviewed effect sizes from five major federal health surveys:
* **Children:** National Survey of Children's Health (NSCH)
* **Adolescents:** CDC Youth Risk Behavior Survey (YRBS)
* **Young Adults:** Behavioral Risk Factor Surveillance System (BRFSS)
* **Adults:** National Health and Nutrition Examination Survey (NHANES)
* **Seniors:** National Health and Aging Trends Study (NHATS)

*Note: All data is illustrative and designed to represent population-level shapes and correlations at the scale of individual stars.*

## Technologies Used
* **HTML5 / CSS3:** Custom styling, sticky scroll-anchoring, and grid layouts.
* **Vanilla JavaScript:** Intersection Observers for scroll-triggered animations and timeline tracking.
* **D3.js (v7):** Data binding, scales, transitions, and custom SVG generation (including `d3.symbolStar`, `d3.area`, and `d3.line`).

## Running the Project Locally
To view and edit the project on your local machine, you will need to run a local server to bypass CORS restrictions when loading the CSV data files.

1. Clone or download the repository to your local machine.
2. Open your terminal.
3. Navigate into the project folder using the `cd` command. 
4. Start a local Python server by running:
   ```bash
   python3 -m http.server 8000
