---
title: Understanding Binary and Hexadecimal numbers
summary: Everything you'll need to know about binary and hexadecimal notation
date: 04/03/2022
image: /img/binary_and_hex.png
image_alt: Don't worry, it's not as complicated as it seems.
---

Okay, first things first. Before you start diving into all this crazy emulator stuff, you need to know about binary and hexadecimal numbers. You might already know about these, but I encourage you to take a look at this post anyway, if anything, for a quick refresh.

Alright, let's get started.

## Understanding decimal

To more easily understand binary and hexadecimal, we must first understand decimal and how it works.

Oh, right. "Decimal" is what we call the numeral system we most commonly use; the one they taught you in school. Numbers such as 17, 569, and 3241 all in decimal notation. It's called "decimal" because each of its digits can have one of 10 different values (0..9). As such, each positioned digit in the decimal representation of a number indicates a value 10 times bigger than that of the digit to its left. That's why we call them "ones", "tens", "hundreds", "thousands", and so on.

Now, how do you usually "read" a number in decimal notation? Since we're so used to reading them this way, we don't really think about it much. However, a more detailed representation of the calculation to obtain its value (using the number 4619 as an example) would be the following:

```text
4619 = 4 * 10^3 + 6 * 10^2 + 1 * 10^1 + 9 * 10^0
     =   4000   +    600   +    10    +    9
     = 4619
```

...and here's the same thing on a table:

|              **Digit** |  4   |  6   |  1   |  9   |
| ---------------------: | :--: | :--: | :--: | :--: |
|           **Position** |  3   |  2   |  1   |  0   |
|              **Value** | 10^3 | 10^2 | 10^1 | 10^0 |
| **Value (calculated)** | 4000 | 600  |  10  |  9   |

As you can see, to calculate the value of a decimal number, we multiply each digit by `10^n`, where `n` is the position of the digit in the number from right to left, starting at zero. This is because, as I said before, each digit represents a value 10 times bigger than that of the digit to its left. Then, we add everything up. Easy, right?

Keep this in mind.

## Understanding binary

As you probably already know, computers at their bare minimum can only work with ones and zeros, since they carry information via streams of electric currents, which can only be either "on" or "off". This, of course, makes it impossible to transmit numbers in the notation we all know and love — decimal.

To counter this, some pretty smart guys came up with the idea of **binary numbers**. They're the same thing as a decimal/regular number, just that they're represented in a different way.

First, a bit of terminology (I swear, pun not intended). In a binary number, each digit is called a **bit**. A bit is the smallest unit of data in a computer. It can hold a single value: either `1` or `0`. Well, I guess you could also say it's either "on" or "off", but the numeric representation is the most popular one, and it's easier to write down anyway. A single bit is not very useful for storing things, though, so they're commonly grouped together in **nibbles** and **bytes**. A nibble is simply a group of 4 bits, and a byte is a group of **2 nibbles**, or **8 bits**, such `1101 0011` or `1010 1001`.

Okay, back to numbers. So, a byte has 8 bits, each of which can have a value of either `1` or `0`, right? Binary numbers are represented using these.

Let's take a look at a comparison between decimal and binary, shall we? I'll use the number 29 as an example:

| Decimal |  Binary  |
| :-----: | :------: |
|   29    | 00011101 |

Okay, cool. But why?

Well, of course, each bit (digit) in a binary number can only have two possible values. Therefore, whereas the value of a decimal digit is 10 times bigger than that of the digit to its left, the value of a bit is 2 times bigger than that of the digit to its left. That's pretty much all there's to it! Apart from the difference in possible values for each digit, it can be calculated like a regular number.

To illustrate this, let's take a look at this binary number in a table similar to the one I made before. (I'll ignore the last 3 bits, since they don't have any value due to being `0`)

|                **Bit** |  1  |  1  |  1  |  0  |  1  |
| ---------------------: | :-: | :-: | :-: | :-: | :-: |
|           **Position** |  3  |  3  |  2  |  1  |  0  |
|              **Value** | 2^4 | 2^3 | 2^2 | 2^1 | 2^0 |
| **Value (calculated)** | 16  |  8  |  4  |  0  |  1  |

Then, we add up our results: `16 + 8 + 4 + 0 + 1 = 29`. _Voilá_! You just converted a binary number to decimal.

As you may realize, a byte is kinda small. More precisely, it can only represent numbers up to 255. The solution? Make it longer!

We can join 2 bytes together to create 16-bit , such as `1011 0101 1001 1100`. This is called a **16-bit number**, and it hold values up to 65535. Not enough? Keep going! Join 4 bytes together to create a **32-bit number**, and 8 for a **64-bit number**. The main takeaway from here is that binary numbers come in different sizes: 8, 16, 32, and 64.

To make the CHIP-8 emulator, you'll mainly be working 8-bit numbers, and occasionally 16-bit ones. Early computers — such as the ones CHIP-8 was originally created for — had very limited memory space, so they couldn't afford even 32-bit numbers.

Now, you don't need to be able to read binary easily to go on with this project, or anything like that. However, it's important to know how the system works and what it represents.

Congratulations! You can (sort of) understand binary now. Practice counting from 1 to 10 to impress your friends ;)

![Now you're ready to hack NASA.](/img/joke_hacker.gif)

## Understanding hexadecimal

Alright, you might have noticed that these binary numbers were getting pretty big. Well, that's where hexadecimal numbers come into place. Like binary, they represent regular numbers, but in yet another different way.

You can imagine hexadecimal (or hex for short) numbers as an easier and shorter way of representing binary numbers. That's what they're mostly used for, after all. Whereas a binary digit (bit) can have 2 possible values, and a decimal digit can have 10, a hexadecimal digit can have — you guessed it — 16 possible values. These are the numbers 0 through 9 plus the letters A through F, or `01234567890ABCDEF`. Of course, the letters A-F represent the numbers 10 through 15. Some examples of hex numbers are `7B`, `B2F7`, and `6C29`.

Now, let's calculate the value of a hex number. Say, `06F5`. Since each hexadecimal digit has 16 possible values, each one of them indicates a value 16 times greater than that of the digit to its left. Let's put our calculations in our handy table.

|          **Hex digit** |  0   |  6   |  F   |  5   |
| ---------------------: | :--: | :--: | :--: | :--: |
|           **Position** |  3   |  2   |  1   |  0   |
|              **Value** | 16^3 | 16^2 | 16^1 | 16^0 |
| **Value (calculated)** |  0   | 1536 | 240  |  5   |

Okay, those numbers are kinda big. In an operation, this would look like the following (Remember that `F` is equivalent to 15):

```text
0 * 16^3 + 6 * 16^2 + F * 16^1 + 5 * 16^0
    0    +   1536   +    240   +    5
```

Add all of those up, and we get **1781**! Now you know how to convert hex numbers to decimal.

Hold on, but why would we want to use these? Well, let's compare a number with its binary and hexadecimal equivalents:

| Decimal |        Binary         | Hexadecimal |
| :-----: | :-------------------: | :---------: |
|  63323  | `1111 0111 0101 1011` |   `F75B`    |

This is just a 16-bit number, but see how big the binary representation is compared to its hex counterpart!

Now, the decimal representation is shorter too, so why would we want to use hex instead of decimal? See, hexadecimal numbers are a better representation of each nibble (group of 4 bits) in the binary number.

|  `F`   |  `7`   |  `5`   |  `B`   |
| :----: | :----: | :----: | :----: |
| `1111` | `0111` | `0101` | `1011` |

That's it! Hexadecimal numbers let us extract information from binary numbers more easily than decimal numbers. This is going to be extremely important for making our emulator, as we'll often have to read data from individual nibbles or bytes of a binary number, a task more suited for representation in hexadecimal.

![Hacking Facebook with hexadecimal.](/img/toy_hacker.gif)

## Finishing up

Phew! I hope all of this wasn't too much to swallow. Feel free to re-read a section if you didn't understand it very well, and try to practice a bit with converting binary and hex numbers to decimal.

In the next post, I'll be talking about how we can manipulate and extract bits from a number, so stay tuned for my post on **bit manipulation with bitwise operators** 👀.

Thanks for reading, and have a nice day!
