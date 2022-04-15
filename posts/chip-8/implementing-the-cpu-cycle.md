---
title: Implementing the CPU cycle
summary: '"This is where the fun begins"'
date: 04/14/2022
image: /img/chip-8/implementing_the_cpu_cycle.png
image_alt: A render of a  CPU
---

The next step is to implement the CHIP-8 instructions on our CPU. Remember the `cycle` method we left empty last post? We'll be implementing it here.

Remember the 5 steps the CPU followed on each cycle?

1. Get the instruction at the memory address `PC` currently points to
2. Increase `PC` by 2
3. Extract the instruction kind and parameters
4. Execute the instruction

Let's go through each of them.

## 1. Fetch the instruction

If you recall from the [CHIP-8 concepts](/posts/chip-8/other-chip-8-concepts) post, you might remember that an instruction fetched by concatenating the byte `PC` currently points to and its next byte.

To concatenate them, we'll use the bitwise OR operator, as I explained in the post about [bitwise operators](/posts/chip-8/bitwise-operators).

```js
CPU {
  // ...
  cycle() {
    var instruction = this.fetch_instruction()
  }

  fetch_instruction() {
    var first = this.memory[this.pc]
    var second = this.memory[this.pc + 1]

    var instruction = (first << 8) | second
    return instruction
  }
}
```

At a high level, we can see that we're shifting the first byte 8 bits to the left. Then, we "OR" it with the second byte. This effectively "moves" the first byte to the upper half of the instruction, and "copies" the second byte onto the lower half.

Let's see how this would work with the bytes, say, `0xF5` and `0x6B`:

```
For reference:
0xF8 = 0b11110101
0x6B = 0b01101011

0xF8 << 8 = 0b1111010100000000 = 0xF800

 0xF800  |  0b1111010100000000   OR
 0x006B  |  0b0000000001101011
-------------------------------  =
 0xF86B  |  0b1111010101101011
```

Okay, maybe I made it seem more complicated than it is. Hope you get the idea. 😅

Also, if you're using a lower-level language, you might want to make sure you're converting the bytes to 16-bit numbers before concatenating them. It might seem pretty obvious, but I wanted to mention it just in case.

## 2. Increase the program counter

Pretty straightforward. Do keep in mind that it should be increased by 2, not 1! You don't wanna end up in the second half of the instruction you just executed.

## 3. Decode the instruction

A CHIP-8 instruction, when represented in hexadecimal, contains a handful of values which indicate what instruction to execute, as well as some parameters it might take.

The parameters you'll have to extract are `-x--`, `--y-`, `---n`, `--nn`. and `-nnn`. I used dashes (`-`) to indicate at what part of the instruction they're at. Note that not all instructions use these parameters, but it's a good idea to always extract them beforehand.

Also, I like to refer to the first nibble of the instruction as the "kind", as it's what determines for the most part which instruction to execute.

I'll refer to the parameters as `x`, `y`, `n`, `nn`, and `nnn`. `x` and `y` are **always** used to refer to one of the 16 registers (`V0-VF`), so keep that in mind. You should **never** use them as an immediate value! On the other hand, `n`, `nn`, and `nnn` are always used as immediate values.

Some code to extract the parameters might look like this:

<!-- prettier-ignore -->
```js
var kind = (instruction & 0xF000) >> 12 // k---
var x    = (instruction & 0x0F00) >> 8  // -x--
var y    = (instruction & 0x00F0) >> 4  // --y-
var n    =  instruction & 0x000F        // ---n
var nn   =  instruction & 0x00FF        // --nn
var nnn  =  instruction & 0x0FFF        // -nnn
```

As you can see, we're using bit masking to extract individual parts of the instruction opcode, and shifting their position to adjust them.

## 4. Execute the instruction

Ah, finally! This is where all the cool stuff happens. On this step, you'll have to check the instruction kind and execute some code accordingly. In this case, a `switch` statement is probably your best bet (Good luck to the Python guys on that). Note that there are multiple "sub-instructions" for kinds `0`, `8`, `E`, and `F`, so you might want to use a nested `switch` statement on those.

For your convenience, here's a full CHIP-8 instruction table I made! Even though they aren't particularly useful for this, I included the instruction mnemonics anyway, but you don't need to worry about them.

| Opcode | Mnemonic      | Description                                                                                                         |
| :----: | :------------ | :------------------------------------------------------------------------------------------------------------------ |
| `0nnn` | `SYS addr`    | Jumps to a machine code subroutine at `nnn`. **(This instruction is ignored in modern interpreters!)**              |
| `00E0` | `CLS`         | Clears the display.                                                                                                 |
| `00EE` | `RET`         | Returns from a subroutine by popping the value at the top of the stack and setting `PC` to it.                      |
| `1nnn` | `JP addr`     | Jumps to the address `nnn`.                                                                                         |
| `2nnn` | `CALL addr`   | Calls a subroutine at address `nnn` by pushing `PC` on top to the stack and jumping to `nnn`.                       |
| `3xnn` | `SE Vx,byte`  | Skips the next instruction if `Vx` is equal to `nn`.                                                                |
| `4xnn` | `SNE Vx,byte` | Skips the next instruction if `Vx` is **not** equal to `nn`.                                                        |
| `5xy0` | `SE Vx,Vy`    | Skips the next instruction if `Vx` is equal to `Vy`.                                                                |
| `6xnn` | `LD Vx,byte`  | Sets `Vx` to `nn`.                                                                                                  |
| `7xnn` | `ADD Vx,byte` | Adds `nn` to `Vx`.                                                                                                  |
| `8xy0` | `LD Vx,Vy`    | Sets `Vx` to the value of `Vy`.                                                                                     |
| `8xy1` | `OR Vx,Vy`    | Performs a bitwise OR operation on `Vx` and `Vy`, storing the result in `Vx`.                                       |
| `8xy2` | `AND Vx,Vy`   | Performs a bitwise AND operation on `Vx` and `Vy`, storing the result in `Vx`.                                      |
| `8xy3` | `XOR Vx,Vy`   | Performs a bitwise XOR operation on `Vx` and `Vy`, storing the result in `Vx`.                                      |
| `8xy4` | `ADD Vx,Vy`   | Adds `Vy` to `Vx`. If there was an overflow, sets `VF` to 1, else sets its to 0.                                    |
| `8xy5` | `SUB Vx,Vy`   | Sets `Vy` to `Vx - Vy`. If there was an underflow, sets `VF` to 0, else sets its to 1.                              |
| `8x06` | `SHR Vx`      | Sets `VF` to 1 if the least significant bit of `Vx` is 1, else sets it to 0. Then, rotates `Vx` 1 bit to the right. |
| `8xy7` | `SUBN Vx,Vy`  | Sets `Vx` to `Vy - Vx`. If there was an underflow, sets `VF` to 0, else sets its to 1.                              |
| `8xyE` | `SHL Vx`      | Sets `VF` to 1 if the most significant bit of `Vx` is 1, else sets it to 0. Then, rotates `Vx` 1 bit to the left.   |
| `9xy0` | `SNE Vx,Vy`   | Skips the next instruction if `Vx` is **not** equal to `Vy`.                                                        |
| `Annn` | `LD I,addr`   | Sets `I` to `nnn`.                                                                                                  |
| `Bnnn` | `JP V0,addr`  | Jumps to `V0 + nnn`.                                                                                                |
| `Cxnn` | `RND Vx,byte` | Generates a random number between 0 and 255, ANDs it with `nn`, and stores it in `Vx`.                              |
| `Dxyn` | `DRW Vx,Vy,n` | Draws an `n`-bytes long sprite from address `I` at coordinates (`Vx`, `Vy`).                                        |
| `Ex9E` | `SKP Vx`      | Skips the next instruction if the key of value `Vx` is currently pressed.                                           |
| `ExA1` | `SKNP Vx`     | Skips the next instruction if the key of value `Vx` is currently **not** pressed.                                   |
| `Fx07` | `LD Vx,DT`    | Sets `Vx` to the value of the delay timer.                                                                          |
| `Fx0A` | `LD Vx,K`     | Waits for a key press, then stores the value of the pressed key in `Vx`.                                            |
| `Fx15` | `LD DT,Vx`    | Sets the delay timer to the value of `Vx`.                                                                          |
| `Fx18` | `LD ST,Vx`    | Sets the sound timer to the value of `Vx`.                                                                          |
| `Fx1E` | `ADD I,Vx`    | Adds `Vx` to `I`.                                                                                                   |
| `Fx29` | `LD F,Vx`     | Sets `I` to the location of the font sprite for the digit `Vx`.                                                     |
| `Fx33` | `LD B,Vx`     | Stores the 3 decimal digits of `Vx` in memory locations `I`, `I+1` and `I+2`.                                       |
| `Fx55` | `LD [I],Vx`   | Stores the values of `V0` through `Vx` in memory starting at address `I`.                                           |
| `Fx65` | `LD [I],Vx`   | Fills `V0` through `Vx` with values from memory starting at address `I`.                                            |

Don't be overwhelmed by all those instructions, though! We'll go through them one by one; it's not as hard as it might seem.

For starters, part of your "execute" code could look something like this:

<!-- prettier-ignore -->
```js
// ...
switch (kind) {
	case 0x0:
		switch (nnn) {
			case 0x0E0:
				clearDisplay()
				break
			case 0x0EE:
				this.ret()
				break
			default:
				print('Attempted SYSCALL to address ' + nnn)
		}
		break
	case 0x1:
		this.pc = nnn
		break
	// ...more instructions down here
}
```

## Wrapping things up

I hope you now have a better understanding of how the CHIP-8's "CPU" works, and the steps required to make it work.

Now, don't worry. I won't leave you to implement all of those instructions by yourself. In the next post, we'll go more in-depth into each instruction, and we'll (hopefully) get our first program up and running! (I'd suggest you implement some of them yourself, though. It's not that fun if you're straight-up told how to do it, is it? 🤔)
