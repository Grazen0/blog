---
title: Specs Overview
summary: A quick look at the specs of the CHIP-8 and their purpose
date: 09/03/2022
image: /img/chip-8/specs_overview.jpg
image_alt: A random cool microchip image I found
---

Now that you've grasped some imporant concepts, let's talk CHIP-8. The last step before making this emulator is to plan your project, and that's exactly what we'll be doing here.

(**Quick note:** From now on, I'll be using the prefix `0x` to indicate that a number is in hexadecimal, and `0b` to indicate that it's in binary. In fact, you can probably use these prefixes in your own programming language to indicate the same thing!)

## Specs

These are the specs for the CHIP-8 according to [this document](http://www.cs.columbia.edu/~sedwards/classes/2016/4840-spring/designs/Chip8.pdf):

- 4096 bytes of addressable memory
- A 16-bit program counter (PC)
- 16 8-bit registers (V0-VF)
- A 16-bit index register (I)
- A 64-byte stack with an 8-bit stack pointer
- An 8-bit delay timer (DT)
- An 8-bit sound timer (ST)
- A 64x32 frame buffer

Alright, let's take a look into each one of these.

### Memory

To put it simple, you can imagine the memory of the CHIP-8 as an array of 8-bit numbers with the length 4096. Therefore, values can be addressed with the indexes 0-4095. The memory mainly stores program instructions and sprite data (Don't worry, we'll get into sprites later).

When a program is loaded into a CHIP-8 emulator, its contents are copied into memory starting at address `0x200`, or 512 in decimal. This is due to the fact that, back in the COSMAC VIP, the original CHIP-8 interpreter itself occupied the first 512 bytes of available memory. Of course, occupying program memory isn't an issue nowadays, but virtually every existing CHIP-8 program expects itself to be loaded into address `0x200`.

### Program counter

The program counter is just a 16-bit number that points to the current instruction in memory. Therefore, it's incremented by a certain amount on each instruction. Simple!

### Registers

You can think of registers as sort of "variables" a program has access to. CHIP-8 has 16 8-bit registers, which are labelled `V0` through `VF`. The last register (`VF`) is also called the carry flag, as it's used to indicate when an arithmetic operation has caused an integer overflow.

To implement the registers, you can simply use an array of 8-bit numbers with the length 16.

### Index register

This one's pretty straightforward. It's a 16-bit number used to point to memory addresses on certain instructions. Just use a 16-bit number variable.

### Stack and stack pointer

Since these two are closely related, I thought I'd put them in the same section.

In case you don't know what a stack is, it's a simple "Last in, first out" data structure. Think of a stack of plates. You add plates to the top, and when you want to get one back, you take it from the top, right? That's a stack. It has two basic operations: "push" and "pop". They add and remove items from the stack, in that order. [Learn more about stacks here](https://www.geeksforgeeks.org/stack-data-structure/)

Now, the spec in the document I found specifies that the stack must be 64-bytes long (have a maximum length of 64 8-bit numbers), but most CHIP-8 programs only use up to 12 or 16 at max.

To implement a stack, the original CHIP-8 interpreter used something similar to an array of 16-bit numbers with length 12 or 16. It also used an 8-bit index number called "stack pointer", which was incremented and decremented accordingly to indicate which was the current number at top of the stack.

You could implement this same solution with an array and a number, _or..._ you could use some growable array type provided by your language, such as an `ArrayList` or `LinkedList` in Java, or a `Vec<u16>` in Rust. Since these lists can vary in size, you can just push and pop items without having to worry about a stack pointer.

However, by using a growable list structure, stack overflow errors (which occur when a program tries to push a value to a full stack) won't occur because these data structures are usually of near-infinite maximum length. For this reason, I'd personally recommend using the traditional approach, which lets you catch the afromentioned stack overflow errors.

I dunno, the choice is yours, anyways.

![Array and stack pointer, or growable list?](/img/the_matrix_choose.gif)

### Delay and sound timers

The theory is simple. Both are 8-bit numbers, which are decremented at a rate of **60 times per second**. The delay timer is used, well for timing purposes. As for the sound timer, as long as it's 0, a single monotone beep should play.

It should be noted that, of course, a timer won't decrease if it's already 0.

### Frame buffer

This is actually just a fancy word for "screen". The display has a size of 64x32 pixels, and each pixel can either be **on** or **off**. Additionally, it refreshes at a max rate of **60 times per second**.

The implementation is up to you. Maybe you could use the terminal itself as a screen, or maybe there's a GUI library out there for your language. All in all, pretty much anything's fine as long as it can display stuff and can refresh 60 times per second.

## Wrapping up

So, that's it for the CHIP-8 specs. We're almost set-up to begin building our emulator! There's just a couple of CHIP-8-specific concepts left, but I'll explain them in the next post.

![(Almost.)](/img/doc_brown_ready.gif)

Welp, I'm outta here now. See you in the next post!
