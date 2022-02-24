<img src="https://user-images.githubusercontent.com/2822227/46310803-307acd80-c575-11e8-9015-cb1a066849ea.jpeg" alt="6spiral_logo_image" width="430" height="">

# 🌀6Spiral Figma Plugin v1.0

[![Price: free](https://img.shields.io/badge/price-FREE-0098f7.svg)](https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin/blob/master/LICENSE.txt)
[![Version: 1.0](https://img.shields.io/badge/version-1.0_-green.svg)](https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin/blob/master/LICENSE.txt)
[![License: MIT](https://img.shields.io/badge/works_with-Figma-blue.svg)](https://www.figma.com/community/plugin/1074706773545183504)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Make%20great%20looking%20spiral%20and%20helix%20shapes%20in%20Figma&url=https://github.com/matej-marjanovic/6Spiral-Figma-Plugin&hashtags=design,sketch,sketchapp,uiux)

**With 6Spiral you can draw spirals and 3D-like helix shapes at a specified angle in parallel projection.**

6Spirals supports creation of the two most common types of spirals: **Archimedean Spirals** and **Logarithmic Spirals**.

*This plugin is based on a plugin that I originally developed for Sketch but that plugin no longer works with the latest version of Sketch.*

# Getting Started

1. Install the [latest release](https://www.figma.com/community/plugin/1074706773545183504) 
3. Make or select a shape/artboard and then right click and go to `Plugins -> 🌀6Spiral`  
4. Change the parameters to make the initial shape of the spiral/helix that you'd like.

<img width="506" alt="6spiral_demo_1" src="https://user-images.githubusercontent.com/2822227/45353519-dd15f080-b56f-11e8-91e1-05ce76b5ff1a.png">

Plugin will create a spiral with the origin at the center of the selected shape.
*The center of the spiral shape is not the same as the origin (first point) of the spiral.*

## Making a Spiral
![6spiral_making_spirals](https://user-images.githubusercontent.com/2822227/45357080-13586d80-b57a-11e8-851c-8366dbbc45b5.gif)

## Making a Helix
![6spiral_making_helix](https://user-images.githubusercontent.com/2822227/45357902-a5617580-b57c-11e8-9050-9b617be0d2c8.gif)

# Few Examples Shapes

## Logarithmic Spirals Example
![log_spiral_examples_wide](https://user-images.githubusercontent.com/2822227/45360143-89150700-b583-11e8-9fda-bfed87f18dfb.png)

## Spiral Helix Examples at 60° isometric angle
![helix_spiral_examples](https://user-images.githubusercontent.com/2822227/45360142-89150700-b583-11e8-912b-6972eb293bd7.png)


# Reporting Issues, Feedback, More Info, ... 
👋 Hi. Feel free to [open an issue here on Github](https://github.com/matej-marjanovic/6Spiral-Figma-Plugin/issues).

[This medium article has some of the same info but also includes more ideas and suggestions on where to use this plugin.](https://medium.com/@matejmarjanovic/4a921c13f5ef)

Thanks to [Sures](https://github.com/sureskumar/) for feedback on the beta version of the original Sketch plugin.

## Known Issues

- Setting some of the parameters to just the minus sign can make the spiral dissapear. Simply close and reopen the plugin (you will have to change the parameters again from the defaults). If you're setting a negative value, make sure that you're adding a minus in front of a number, not just a minus on its own.
- Having too much fun with 6Spiral can cause Sketch to crash sometimes 😅.

Issues can also be mitigated/lessened by disabling the "Continously Update" option and pressing the "Update Spiral" each time you want to update the spiral to the changed parameters.

## A few resources that I found useful for developing this Figma Plugin
This plugin was built with the help of Thomas Lowry's boilerplate for Figma plugins:
- https://github.com/thomas-lowry/figma-plugin-boilerplate

Official Figma plugin docs:
- https://www.figma.com/plugin-docs/


