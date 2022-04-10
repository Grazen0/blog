---
title: Building a Z80 disassembler
summary: 'To understand Pac-Man, one must first disassemble Pac-Man.'
date: 04/10/2022
image: /img/pac-man-emulator/building-a-z80-disassembler.png
image_alt: Drawing of a stick figure thinking
---

Right before getting started with the emulator, I thought it would be a good idea to try out making my own disassembler for Z80 machine code for a couple of reasons:

- It would help me get used to the Z80 and instructions.
- It could be a good idea to have the source for the game for debugging purposes later on.
- Disassembling machine code isn't very hard. (Though tedious)

So, let's go!

## The objective

My objective was to create a disassembler capable of transforming this machine code...

```
F3 3E 3F ED 47 C3 0B 23 77 23 10 FC C9 C3 0E 07
85 6F 3E 00 8C 67 7E C9 78 87 D7 5F 23 56 EB C9
E1 87 D7 5F 23 56 EB E9 E1 46 23 4E 23 E5 18 12
11 90 4C 06 10 C3 51 00 AF 32 00 50 32 07 50 C3
38 00 2A 80 4C 70 2C 71 2C 20 02 2E C0 22 80 4C
C9 1A A7 28 06 1C 1C 1C 10 F7 C9 E1 06 03 7E 12
23 1C 10 FA E9 C3 2D 20 00 01 02 03 04 05 06 07
08 09 0A 0B 0C 0D 0E 0F 10 11 12 13 14 01 03 04
06 07 08 09 0A 0B 0C 0D 0E 0F 10 11 14 F5 32 C0
50 AF 32 00 50 F3 C5 D5 E5 DD E5 FD E5 21 8C 4E
...
```

...into this output:

```
09DC 21 04 4E        ld      hl, #4E04
09DF 34              inc     (hl)
09E0 AF              xor     a
09E1 32 AC 4E        ld      (#4EAC), a
09E4 32 BC 4E        ld      (#4EBC), a
09E7 C9              ret
09E8 0E 02           ld      c, #02
09EA 06 01           ld      b, #01
09EC CD 42 00        call    #0042
09EF F7              rst     #30
09F0 42              ld      b, d
...
```

As you can see, each instruction includes its memory address, bytes, mnemonic and parameters, if any.

## Making the disassembler

My first step was implementing a basic struct that could iterate over an array of bytes. I could have implemented the `Iterator` trait on it, but I didn't really like how it forced me to return an `Option<u8>` instead of just `u8`. The first one would probably be safer, but I suppose it's alright for a program this simple.

Also, the disassembler should keep track of the bytes it consumes, so that they can be pulled/retrieved when an instruction is written to the output.

```rust
use std::fs::File;
use std::io;
use std::io::Write;

struct Disassembler {
  data: Vec<u8>,
  used_bytes: Vec<u8>,
  position: usize,
}

impl Disassembler {
  fn new(data: &[u8]) -> Self { /* ... */ }

  fn disassemble(&mut self, mut out: impl Write) -> io::Result<()> {
    // TODO
    Ok(())
  }

  fn next(&mut self) -> u8 {
    let val = self.data.get(self.position).copied().unwrap_or(0);
    self.used_bytes.push(val);
    self.position += 1;
    val
  }

  fn next_u16(&mut self) -> u16 {
    // The Z80 is little-endian, so the low nibble is stored first
    let lo = self.next() as u16;
    let hi = self.next() as u16;
    (hi << 8) | lo
  }
}
```

With this, I can get started on disassembling and writing instructions to the output.

An instruction's memory address is simply the value of `position` before the opcode was consumed, while the instruction bytes can be pulled from `used_bytes`. The mnemonic and parameters are what I need to put manually.

### Pro-tip: Macros

In order to write instructions without needing much boilerplate, I made a [macro](https://doc.rust-lang.org/book/ch19-06-macros.html) that takes in a mnemonic string, and zero or more parameter strings.

```rust
macro_rules! instr {
  ($name:expr) => { ($name, vec![]) };
  ($name:expr, $( $p:expr ),+ $(,)?) => {
    ($name, vec![$(
      match $p {
        "(**)" => format!("(#{:04X})", self.next_u16()),
        "**" => format!("#{:04X}", self.next_u16()),
        "(*)" => format!("(#{:02X})", self.next()),
        "*" => format!("#{:02X}", self.next()),
        "(ix+*)" => format!("(ix+#{:02X})", self.next()),
        _ => String::from($p)
      }
    ),+])
  };
}
```

For each parameter, it replaces `"**"` and `"*"` by consuming the next one or two bytes, depending on the size of the parameter. Then, it returns a tuple containing the provided mnemonic and a `Vec` with the transformed parameters.

## Adding instructions

I found a really good [Z80 instructions table](https://clrhome.org/table/), which what I used to find the mnemonic and parameters for each opcode. Other than that, the process was fairly straightforward:

```rust
pub fn disassemble(&mut self, mut out: impl Write) -> io::Result<()> {
  macro_rules! instr { /* The macro I showed before */ }

  self.position = 0;

  while self.position < self.data.len() {
    let adr = self.position;
    let opcode = self.next();

    let (mnemonic, params) = match opcode {
      0x00 => instr!("nop"),
      0x01 => instr!("ld", "bc", "**"),
      0x02 => instr!("ld", "(bc)", "a"),
      // ...
    };

    // Pull bytes used by the instruction
    let used_bytes: Vec<String> = self.used_bytes.iter().map(|b| format!("{:02X}", b)).collect();
    self.used_bytes.clear();

    writeln!(out, "{:04X} {:012}    {:04}    {}", adr, used_bytes.join(" "), mnemonic, params.join(", ")?;
  }

  Ok(())
}
```

(Rust's `format!` macro is amazing, by the way!)

From what the instruction table shows, the Z80 replaces some undocumented 8080 opcodes with its own instructions, a couple of which enable whole additional instruction tables. For these, I had to use some nested `match`es.

Anyways, after implementing all of the main and EXTD instructions, I noticed my IDE was starting to get really slow. Also, compilation time began ramping up real quick. So much, in fact, that it took over 5 minutes to compile at one point.

Uh oh.

Fortunately, from what I've seen on my disassembled output, Pac-Man barely uses many of the Z80's extended instructions (if any). Because of this, I simply skipped implementing the IX and IY instructions. Work smarter, not harder!

Finally, I ran the disassembler on the full Pac-Man ROM one final time.

```
0000 F3              di
0001 3E 3F           ld      a, #3F
0003 ED 47           ld      i, a
0005 C3 0B 23        jp      #230B
0008 77              ld      (hl), a
0009 23              inc     hl
000A 10 FC           djnz    #FC
000C C9              ret
000D C3 0E 07        jp      #070E
0010 85              add     l
0011 6F              ld      l, a
0012 3E 00           ld      a, #00
...
```

Success! An uncompleted (but mostly functional) Z80 machine code disassembler that takes way too much time to compile, but should be enough to help me debug my emulator.
