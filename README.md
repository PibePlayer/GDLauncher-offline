<<<<<<< HEAD
# Koala Launcher [![Discord][discordImg]][discordLink] [![CI][ciImg]][ciLink] [![GHReleases][ghrImg]][ghrLink]
=======
# GDLauncher
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity) 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) 
[![GitHub issues](https://img.shields.io/github/issues-raw/gorilla-devs/GDLauncher.svg)](https://github.com/gorilla-devs/GDLauncher/issues) 
[![GitHub pull requests](https://img.shields.io/github/issues-pr/gorilla-devs/GDLauncher.svg)](https://github.com/gorilla-devs/GDLauncher/pulls) 
![Discord](https://img.shields.io/discord/398091532881756161.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/gorilla-devs/GDLauncher.svg) 
![](https://img.shields.io/github/release/gorilla-devs/GDLauncher.svg?style=flat)
![Github All Releases](https://img.shields.io/github/downloads/gorilla-devs/GDLauncher/total.svg)

## 🦺 Support this project

<a href='https://ko-fi.com/gdlauncher' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
## 🎉 Join our community

<a href='https://discord.gdlauncher.com' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.gdlauncher.com/assets/socials/Discord-Logo+Wordmark-Color.png' border='0' alt='GDLauncher Discord Server' /></a>
<details>
 <summary><strong>Table of Contents</strong> (click to expand)
</summary>

- [GDLauncher](#gdlauncher)
  - [🦺 Support this project](#-support-this-project)
  - [🎉 Join our community](#-join-our-community)
  - [🎮 What is GDLauncher](#-what-is-gdlauncher)
  - [⚡️ Comparison with Twitch Launcher](#️-comparison-with-twitch-launcher)
  - [🚀 Getting Started](#-getting-started)
  - [🎮 Download](#-download)
  - [🎨 Features](#-features)
      - [Our features:](#our-features)
      - [You can also:](#you-can-also)
      - [Some of the features we are still working on are:](#some-of-the-features-we-are-still-working-on-are)
  - [💾 Compilation](#-compilation)
    - [⚙️ Requirements](#️-requirements)
    - [▶️ Steps](#️-steps)
    - [🚚 Packaging](#-packaging)
  - [🚀 Technologies](#-technologies)
  - [🎁 Contributing](#-contributing)
  - [❤️ Author](#️-author)
  - [📜 History](#-history)
  - [🎓 License](#-license)
  </details>
>>>>>>> 7cf4f3a34cb6b4771308a86dce98ab22e59b1836

![Javascript][javascriptImg] ![Love][buildLoveImg]

# ❓ What is the Koala Launcher
Koala Launcher is a fork of KoalaLauncher aiming to be more FOSS Friendy towards Pull Requests and Contribution

<p align="center">
    <img width="800" height="auto" src="https://i.ibb.co/Fb5yzcz/image.png" alt="KoalaLauncher Home" />
</p>

## ⚡ Comparison with Twitch Launcher
This is an example of the time that KoalaLauncher takes to install a modpack in comparison to Twitch. Both tests are running at the same time over a 1Gbps network to ensure that the network doesn't impact the comparison.

- Koala Launcher: `52 seconds`

- Twitch Launcher: `2 minutes, 25 seconds`

<p align="center">
    <img width="800" height="auto" src="https://i.ibb.co/THPh9yt/ezgif-6-527c7e1caa76.gif" alt="KoalaLauncher Pack DL" />
</p>

## ⬇️ Download
To download the latest version, you can either click [here](https://github.com/KoalaDevs/KoalaLauncher/releases) and select the appropriate version for your operating system or visit our [website](https://www.koalalauncher.com/download/).

## 🎨 Features
#### Our features:
- Java downloader. You don't need to have java installed, a suitable version will be downloaded automatically.
- It's as easy as pie to install the vanilla Game, Forge, Fabric, and all CurseForge Modpacks. No further action from the user is required.
- Install mods for both Fabric and Forge directly from our UI
- Built-in auto-updater. The launcher will always keep itself updated to the latest release.
- Easily manage multiple accounts and switch between them.
- Still playing on your grandma pc from the 80s? Don't worry, we got you covered with our Potato PC Mode!
##### You can also:
- Keep track of the time you played each instance
- Add instances to the download queue, they will automatically download one after the other
##### Some of the features we are still working on are:
- Drag and drop instances wherever you like them, just like in your desktop
- Liteloader Support
- Optifine easy-installation support
- Modpacks.ch (FTB) Support
- Technic Support
- Custom Theming
###### and a lot more...


## 💾 Compilation

### ⚙️ Requirements
You need the following software installed:

- [NodeJS](https://nodejs.org/) (> v14.8.0 x64)
- (Rust)[https://www.rust-lang.org/]
- A C++ Compiler ((GCC)[https://gcc.gnu.org/] or (MSVC)[https://visualstudio.microsoft.com/downloads/])
- (Yarn)[http://yarnpkg.com/]
- (Firefox)[https://www.mozilla.org/en-US/firefox/new/]

### ⏩ Steps

#### Install the dependencies
```zsh
yarn
```

#### Start the Development environment

```zsh
yarn start
```

#### Packaging
To package the app for the local platform:

```zsh
set RELEASE_TESTING=true
yarn release
```

## 🗝 Built and managed with

- [Javascript](https://developer.mozilla.org/bm/docs/Web/JavaScript)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [NodeJS](https://nodejs.org/)
- [Yarn](http://yarnpkg.com/)
- [Electron](https://electronjs.org/)
- [Codacy](https://www.codacy.com/)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [ESLint](https://eslint.org/)
- [Ant Design](https://ant.design/)
- [Styled Components](https://styled-components.com/)
- [Rust](https://www.rust-lang.org/)

## 🎁 Contributing

You can find a list of unassigned tasks [here](https://github.com/KoalaDevs/KoalaLauncher/projects). Feel free to ask anything on our discord if you need help or want other tasks.

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## 📜 History

This project was forked from the KoalaLauncher Rewrite due to some internal team drama with the licensing.

## 🎓 License

This project is licensed under the GNU GPL V3.0 - see the [LICENSE](LICENSE) file for details.


[discordImg]: https://img.shields.io/discord/759861708084215838.svg?logo=discord&logoWidth=18&colorB=7289DA&style=for-the-badge
[discordLink]: https://invite.gg/KoalaDevs

[ciImg]: https://img.shields.io/github/workflow/status/KoalaDevs/KoalaLauncher/Linux%20CI?style=for-the-badge
[ciLink]: https://github.com/KoalaDevs/KoalaLauncher/actions

[ghrImg]: https://img.shields.io/github/downloads/KoalaDevs/KoalaLauncher/total?style=for-the-badge
[ghrlink]: https://github.com/CrankySupertoon/KoalaLauncher/releases

[javascriptImg]: https://forthebadge.com/images/badges/made-with-javascript.svg
[buildLoveImg]: https://forthebadge.com/images/badges/built-with-love.svg
