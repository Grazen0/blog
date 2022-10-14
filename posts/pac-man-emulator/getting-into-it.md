---
title: Getting Into It
summary: Checking out the information I need to get started with the emulator
date: 04/05/2022
image: /img/pac-man-emulator/getting_into_it.png
image_alt: Pac-Man arcade gameplay
---

Recently, I made a [Space Invaders emulator](https://github.com/ElCholoGamer/space-invaders/), and I really like how it turned out. However, I don't think I have much merit for it, since I pretty much followed a step-by-step guide at [Emulator101](https://emulator101.com/), though I did learn a lot of new things.

That's why I'm making a Pac-Man emulator! This time, all by myself and without a guide to walk me through the process. I just hope this won't turn into yet another unfinished project in a couple of weeks.

![Hungry boy](/img/pac-man-emulator/chomp.gif)

## Looking for information

First, I looked up some basic information about the game, mostly about its hardware. Apart from a (useful) [really long document](https://github.com/masonicGIT/pacman/blob/master/doc/Hardware) this is what I've found so far:

- The game runs on a [Z80 microprocessor](https://en.wikipedia.org/wiki/Zilog_Z80), clocked at 3.072 MHz.
- The game ROM takes up 16K of memory starting at address 0. (`$0000-$3FFF`)
- The display supports sprite-based graphics.
- The game has a watchdog timer that must constantly be reset, as it's used to automatically restart the machine when it freezes for some reason. Pretty smart solution, I must say!

It's a relief the Z80 is based on the Intel 8080 I emulated for Space Invaders, because that means I won't be starting from scratch. All those opcodes and instructions were reaaally tedious to implement.

Also, here are some sources I found for the memory map:

- [Walk of Mind](https://www.walkofmind.com/programming/pie/hardware.htm)
- [Arcade Restoration](http://arcaderestoration.com/memorymap/6365/Pac-Man.aspx)
- [(Some old unnamed website)](https://www.csh.rit.edu/~jerry/arcade/pacman/daves/)

The game ROM was really easy to find, by the way. All the binary files were zipped up nicely.

```
82s123.7f
82s126.1m
82s126.3m
82s126.4a
pacman.5e
pacman.5f
pacman.6e
pacman.6f
pacman.6h
pacman.6j
```

The `pacman.6*` files are the data that goes into ROM memory, but I have no idea what the other binaries are supposed to be. According to [this memory map](http://arcaderestoration.com/memorymap/6365/Pac-Man.aspx), they _do_ go somewhere, but I don't really understand what the "memory areas" mean.

## Setting up the project

I plan to make this emulator in Rust, just like I did with Space Invaders. The language's been growing on me a lot recently, and I'm feeling more and more comfortable using it.

The setup is pretty much the same as my Space Invaders Emulator: A Cargo workspace with two packages: `core` for the emulator backend and `pacman` for the frontend application.

Run some `cargo new`'s, and it's done.

```
core/
├── src/
│   └── lib.rs
└── Cargo.toml
pacman/
├── src/
│   └── main.rs
└── Cargo.toml
Cargo.toml
```

I'll be using the [SDL2 Rust bindings](https://crates.io/crates/sdl2) for basically everything in the frontend: display, sound, and keyboard input. The backend probably won't need any libraries, though.

## Wrapping up

So, I think that's all for the setup. Now that I have some idea of what I'm doing, I think it's about time to get started.

(On the next post, that is.)
