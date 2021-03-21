// ==UserScript==
// @name         Open in other players
// @namespace    http://juegostrower.tk
// @version      1.0
// @description  Add an open in button to the projects page!
// @author       JuegOStrower
// @include      https://scratch.mit.edu/projects/*/
// @exclude      https://scratch.mit.edu/projects/*/*/
// @grant        none
// ==/UserScript==

document.getElementById("stats").innerHTML += '<div class="action tolltip bottom open"><li class="logged-in-user dropdown"><span class="dropdown-toggle" data-toggle="dropdown">Open in</span><div class="dropdown-menu"><ul><li><a title="The Scratch 3 Beta" target="_blank" href="https://llk.github.io/scratch-gui/#' + document.getElementById("project").getAttribute("data-project-id") + '">Scratch 3 GUI</a></li><li><a target="_blank" title="The Scratch 3 Beta with experimental tools" href="https://llk.github.io/scratch-gui/develop/#' + document.getElementById("project").getAttribute("data-project-id") + '">Scratch 3 GUI Develop</a></li><li><a target="_blank" title="The Scratch 3 Beta with debugging tools" href="https://llk.github.io/scratch-vm/#' + document.getElementById("project").getAttribute("data-project-id") + '">Scratch 3 VM</a></li><li><a target="_blank" title="Run this project in another player" href="https://phosphorus.github.io/#' + document.getElementById("project").getAttribute("data-project-id") + '">Phosphorus</a></li><li class="logout divider"><a title="Download this project for seeing its code" target="_blank" href="https://www.juegostrower.tk/downloader/#' + document.getElementById("project").getAttribute("data-project-id") + '">Download</a></li><li><a title="Play this project with the default viewer (works on unshared projects!)" target="_blank" href="https://www.juegostrower.tk/unsharedviewer/#' + document.getElementById("project").getAttribute("data-project-id") + '">Remote Player</a></li></ul></div></li></div>';