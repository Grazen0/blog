---
title: Other CHIP-8 Concepts
summary: The last things you need to know before making a CHIP-8 emulator
date: 03/19/2022
image: /img/chip-8/other_chip_8_concepts.png
image_alt: Almost there...
---

Okay, okay. We're almost there. In fact, this post probably won't be that long. There's just some final CHIP-8 specific concepts you need to get a decent grasp of before continuing: mainly, sprites and the font.

So, let's get into it!

## 👉 Instructions

I've mentioned "instructions" a couple of times in the last post, but what exactly is an instruction?

![Yeah, what is it?](/img/thinking_emoji.gif)

As we've learned, you could say a CHIP-8 program is just an array of bytes or 8-bit numbers. These are loaded into memory starting at address `0x200`. Because of this, the program couter (`PC`) is also initialized as `0x200`.

On each CPU cycle, or "step", the CPU must get the byte at the memory address that `PC` is currently pointing at, as well as the byte that comes inmediately after it. These two bytes are concatenated together, and we get an instruction!

After this, the program counter should be incremented by 2 to go to the next instruction.

Let's take a look at a more visual example of a CPU cycle:

```js
... 0x10, 0x5F, 0x82, 0xF7, 0x40, 0x00, 0x19, ...
     PC
```

Since `PC` is pointing at the byte `0x10` somewhere in memory, itself and its subsequent byte are concatenated to obtain the current instruction:

```js
      0x105F
       /  \
... 0x10, 0x5F, 0x82, 0xF7, 0x40, 0x00, 0x19, ...
     PC
```

_Voilá!_ The CPU can now execute the instruction `0x105F`, which corresponds to `JMP addr`, or "jump to address". We'll get into how to execute an instruction during the development of our emulator.

However, the CPU should first increment the PC by 2 before executing the current instruction.

```js
... 0x10, 0x5F, 0x82, 0xF7, 0x40, 0x00, 0x19, ...
                 PC
```

Now we're talking!

## 👾 Sprites

In the context of CHIP-8, a "sprite" is like a group of pixels that are displayed together. As it should be clear by now, each pixel can either be "on" or "off", as the CHIP-8 doesn't support colors or anything that fancy. Who needs colors to make cool stuff anyway?

A sprite is represented by a group of consecutive bytes in memory, such as the following:

```js
// ...memory
0b01100110,
0b01100110,
0b00000000,
0b01111110,
0b00111100,
// ...more memory
```

Each byte represents one 8-pixel row of the sprite, where each of its bits determine whether to toggle a corresponding pixel or not. If you look closely, you might notice that this particular sprite is a smily face :D!

Of course, you can represent sprites in hexadecimal, too.

```js
// ...memory
0x66,
0x66,
0x00,
0x7E,
0x3C,
// ...more memory
```

It's not as clear what this sprite actually shows anymore, but, on the good side, it's shorter than binary.

As you may have noticed, sprites have a horitontal size limit of 8 pixels, since that's the length of a byte. However, they're also limited to a maximum height of 15 pixels, for a reason I'll explain in a later post.

## ✍ Font

The font is simply a handful of pre-loaded sprites that CHIP-8 programs should have access to. This set must contain the characters `0123456789ABCDEF`, each represented by an 8x5 sprite.

The "standard" font, as specified by [this cool guide](https://tobiasvl.github.io/blog/write-a-chip-8-emulator), is the following:

```
0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
0x20, 0x60, 0x20, 0x20, 0x70, // 1
0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
0x90, 0x90, 0xF0, 0x10, 0x10, // 4
0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
0xF0, 0x10, 0x20, 0x40, 0x40, // 7
0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
0xF0, 0x90, 0xF0, 0x90, 0x90, // A
0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
0xF0, 0x80, 0x80, 0x80, 0xF0, // C
0xE0, 0x90, 0x90, 0x90, 0xE0, // D
0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
0xF0, 0x80, 0xF0, 0x80, 0x80  // F
```

![The result](/img/chip-8/standard_font.png)

You can copy and paste this into a constant variable in your emulator or something like that. Maybe even try making your own font!

The important part is that you should put these font sprites somewhere in memory. Remember how the first 512 bytes (`0x000-0x1FF`) are empty? This is where you should store them to avoid interferring with program memory. According to the guide I linked before, a popular place to put the sprites is at addresses `0x50-0x9F` for some reason. The exact position of the range doesn't really matter, though, as long as the sprites are within these first 512 bytes.

...

Okay, this post turned out kinda long. _I promise_, we'll finally get started with our emulator! In the next post, that is.

Though, for now, peace out!
