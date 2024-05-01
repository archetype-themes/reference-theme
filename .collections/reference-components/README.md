# Reference Components

The `reference-components` repository is a foundational part of the [Archetype Devkit preview](https://github.com/archetype-themes/devkit). It provides a collection of components that, together, create a simple, straightforward, online-purchasing experience.

This repository contains 4 primary sections: header, media with text, product detail page (PDP), and cart page, and is designed to showcase the structure, patterns, and code conventions behind our approach to theme component development.

Theme components aim to achieve the following value propositions:

- **Focus development on modular components**: Encourage efficient and manageable development by focusing on discrete, well-defined components rather than large, complex codebases. This modularity enables easier customization and faster updates across themes.
- **Standardize code for future-ready Shopify Liquid projects**: Establish coding standards and patterns that ensure future scalability and adaptability.
- **Accelerate enterprise theme creation**: Speed up the development of professional-grade themes to enable quicker deployment and streamlined market entry. This allows developers to leverage common components across all themes, ensuring consistency and quality.
- **Streamline theme catalog maintenance and updates**: Simplify the maintenance and enhancement of your theme portfolio, significantly reducing the resources and effort required. This streamlined approach helps in reusing components and maintaining uniformity across all projects.
- **Reduce regressions with automated testing**: Integrate automated testing to maintain stability and simplify updates, minimizing regressions and reducing the stress associated with deploying new features to your themes.

Our goal is to improve knowledge across the Shopify theme ecosystem and encourage detailed discussions on theme coding patterns and methodologies.

### Resource previews

You can view the [Figma design file]() that accompanies these components as well as view the components in the [Component explorer](https://archetype-components.myshopify.com/) (password `archetype`).

## Table of Contents

- [Getting started](#getting-started)
- [Usage guidelines](#usage-guidelines)
- [Contributing](#contributing)

## Getting Started

### Prerequisites

Before you can work with theme components, you'll need to ensure you have the following tooling installed on your local development machine:

- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install)
- [Shopify CLI Theme Component plugin](https://github.com/archetype-themes/plugin-theme-component)

Once these are installed, clone this `reference-components` repository to your local development machine.

### Reference theme

If you prefer to develop and/or test theme components within a theme context rather than using the component explorer, we've included a [reference theme](https://github.com/archetype-themes/reference-theme) repository as an additional resource. You can clone this repository to your local development machine and use it to learn more about how theme components are implemented and used.

You can find more detailed information in the [reference theme's README](https://github.com/archetype-themes/reference-theme#readme).

## Usage guidelines

Theme components are created, developed, and installed using `shopify theme component`. You can find more detailed information about this command and each of its arguments in the [Shopify CLI Theme Component README](https://github.com/archetype-themes/plugin-theme-component#readme).

All theme components are contained within the `components` directory located at the root directory of this repository.

### Creating components

You can create a new component with the `shopify theme component generate` command. This will generate a new theme component in the `components` directory with boilerplate code.

### Developing components

When developing a theme component, you have two separate workflows to choose from. You can either develop theme components:

- **Inside the component explorer**: the `shopify theme component dev` command launches the component explorer and allows you to develop components in isolation.
- **Inside a theme**: the `shopify theme component dev --theme-path="../reference-theme"` command allows you to develop your components within the context of a specified theme.

### Installing components

You can install a component (or list of components) with the `shopify theme component install` command. This command is only ran within a theme which then imports the latest changes of your components into your theme.

## Contributing

Interested in shaping the future of theme development with us? We welcome you to join our community! Your insights and discussions play a crucial role in our continuous improvement. We encourage you to start [discussions](https://github.com/archetype-themes/devkit/discussions), ask questions, and provide feedback on our component approach.
