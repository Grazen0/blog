---
title: Bitwise Operators
summary: Manipulating numbers and their bits with bitwise operators
date: 06/03/2022
image: /img/bitwise_operators.png
image_alt: I really like these guys.
---

Following my [previoust post](/posts/chip-8/binary-and-hex) about binary and hexadecimal numbers, today we'll be learning about bit manipulation! I must say, using these techniques was one of my favorite parts of making my CHIP-8 emulator.

Well, without further addo, let's get right into it.

Alright, numbers. Numbers in computers are made up of **bits**, like we learned in the last post. These bits can be manipulated using **bitwise operators**. Bitwise operators are present in pretty much every programming language, and, like their name suggests, they operate on numbers at their bit-level.

In most languages, the following bitwise operators are available:

| Operator | Name                     |
| :------: | :----------------------- |
|   `&`    | Bitwise AND              |
|   `\|`   | Bitwise OR               |
|   `^`    | Bitwise XOR              |
|   `~`    | Bitwise NOT / Complement |
|   `<<`   | Bitwise left shift       |
|   `>>`   | Bitwise right shift      |

(Note: Some symbols may vary for some programming languages. For example, in Rust, the bitwise NOT operator is `!`)

Okay, what do these things do?

Well, bitwise operators operate on a per-bit basis. That means that it performs a certain operation on each pair of corresponding bits from the two operands used. Let's take a look at them individually.

## Bitwise operators

### Bitwise AND (&)

As an example, let's see the operation `0110 1110 & 1011 1100`:

```text
  0110 1110
& 1011 1100
= 0010 1100
```

As you can see, the bitwise AND operator, for each corresponding pair of bits, keeps only those where **both** have a value of `1`. Simple, right?

### Bitwise OR (|)

Whereas the bitwise AND operator keeps bits where both corresponding values are `1`, the bitwise OR operator keeps bits where **at least one** of the corresponding values is `1`.

```text
  0110 1110
| 1011 1100
= 1111 1110
```

See?

### Bitwise XOR (^)

The bitwise XOR operator keeps bits where only one of the corresponding values is `1`, and the other one is `0`.

```text
  0110 1110
| 1011 1100
= 1101 0010
```

### Bitwise NOT (~)

Also called _complement_, this operator inverts the values of all bits in a number. Of course, this means it only uses one operand.

```text
~ 0110 1110
= 1001 0011
```

### Bitwise left shift (<<)

This operator shifts (moves) all bits in a number by a certain amount of positions, determined by the second operand. Bits with the value `0` are inserted to the right side.

```text
  0110 1110 << 2 (decimal)
= 1011 1000
```

Note that the second operand is in decimal, for better understanding. The bits of the first operand are moved 2 positions to the left.

### Bitwise right shift (>>)

Same as the bitwise left shift operator, but moves bits to the right instead. Bits with the value `0` are inserted to the left side.

```text
  0110 1110 >> 2 (decimal)
= 0001 1011
```

Again, the second operand is in decimal for better understanding. The bits of the first operand are moved 2 positions to the right

Alright, that's it for the operators!

## Bit manipulation techniques

Now that you know about bitwise operators and what they do, let's take a look at some practical ways we can use them to our advantage.

### Bit masking

Say we had the number `1000 0110 1101 1010`. What if we needed to extract its second nibble (`1101`) as a separate number? Bit masking to the rescue!

By using the bitwise AND operator, we can "mask" a specific part of the number, so that we only keep those bits.

Check this out:

```text
  1000 0110 1101 1010
& 0000 0000 1111 0000
= 0000 0000 1101 0000
```

Here, we've used a **bit mask** (`0000 0000 1111 0000`) to only keep the bits in the second nibble of the number.

Now, we can use the bitwise right shift operator to adjust the bits' position.

```text
  0000 0000 1101 0000 >> 4 (decimal)
= 0000 0000 0000 1101
```

Nice! We have successfully extracted a specific portion of the number, and adjusted its position to get the right value.

Note that doing all of this could be less verbose by using hexadecimal numbers, though!

Remember how we learned in the previous post that each digit in a hexadecimal number represents exactly one nibble of its binary counterpart? This is where that fact comes in handy.

We can use the hexadecimal equivalents of the numbers we've been using so far for a shorter version of our operations.

So, the original number we wanted to extract the nibble from was `1000 0110 1101 1010`, right? That's equivalent to `86DA`.

|   8    |   6    |   D    |   A    |
| :----: | :----: | :----: | :----: |
| `1000` | `0110` | `1101` | `1010` |

Then, our bit mask (`0000 0000 1111 0000`) is equivalent to `00F0`:

|   0    |   0    |   F    |   0    |
| :----: | :----: | :----: | :----: |
| `0000` | `0000` | `1111` | `0000` |

Our first operation would now look like this:

```text
  86DA
& 00F0
= 00D0
```

See? Since each digit in a hexadecimal number maps to a nibble in its binary counterpart, we can use `F` in bit masks for extracting specific nibbles, which is want we want to do here.

The next operation (bitwise right shift) is pretty similar to the previous one:

```text
  00D0 >> 4 (decimal)
= 000D
```

Since each hexadecimal digit represents a nibble, or 4 bits, the `D` gets moved to the next digit to the right.

### Bit concatenation

As you might have guessed, this technique is used to concatenate or "join" two groups of bits together.

Let's do an example by concatenating the numbers `1101` and `1001`.

First, we must use the **bitwise left shift** operator on the number that'll go to the right. Say, `1101`.

```text
  0000 1101 << 4 (decimal)
= 1101 0000
```

Just like that, we've moved the bits to the next nibble.

Now, we use the **bitwise OR** operator to "join" the two numbers.

```text
  1101 0000
| 0000 1001
= 1101 1001
```

That's it! We've concatenated the binary numbers `1101` and `1001` using bitwise operators.

## Finishing up

That's about it for bitwise operators! Well, at least this is the stuff we'll use to build our CHIP-8 emulator, anyway. There's a handful more techniques that I haven't covered, but the ones I've shown here are probably the most important ones, anyway.

As usual, stay tuned for the next post. See ya!
