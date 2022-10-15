---
title: JavaScript Generators
summary: A dive into generator functions and iterators in JS
date: 14/10/2022
image: /img/in-case-you-didnt-know/js-generators.jpg
image_alt: A mechanism made out of gears
---

Heya, welcome to "In Case You didn't know"! For this first post, we'll be learning about generator functions and iterators in JavaScript. Admittedly, this is kind of a niche feature in the language, but hey, that's just what this category was made for! Let's get started, shall we? 🤖

## What's a generator function?

A generator function is a function that returns a `Generator` object. (Very smart, I know). The main use of a `Generator` is to provide a way to iterate over a list of items. What makes these functions special is that they can be paused and resumed as they `yield` values one by one.

Generator functions are declared with an asterisk following a `function` keyword, and an example might look like this...

```js
function* count(max) {
	for (let i = 0; i <= max; i++) {
		yield i;
	}
}

const gen = count(3); // Create the generator

console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);
```

...which produces the following output:

```
0
1
2
3
```

As you can see, a `Generator` object, prominently, contains a `.next()` method, which executes the generator function until it yields the next item.

It is important to note that, as the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) put it, calling a generator function doesn't execute its body immediately. Instead, the `Generator` object is returned immediately. With this, every time `.next()` is called, the function's body _will_ execute until it reaches the `yield` keyword, at which point the function pauses and "returns" the yielded value as the next item.

One neat thing about generator functions is that they can be infinite, as they don't have to finish executing completely to yield values. Say, here's an example:

```js
function* infiniteCounter() {
	let i = 0;
	while (true) {
		yield i;
		i++;
	}
}

const gen = infiniteCounter();

console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
console.log(gen.next().value); // 4
console.log(gen.next().value); // 5
// And you could go on forever...
```

Additionally, `Generator` results have a `done` property, which can be used to check if the generator function has ended execution.

```js
function* greetings() {
	yield 'morning';
	yield 'afternoon';
	yield 'evening';
}

const gen = greetings();
let currentResult = gen.next();

while (!currentResult.done) {
	console.log(`Good ${currentResult.value}!`);
	currentResult = gen.next();
}

console.log('Finished');
```

This program outputs the following:

```
Good morning!
Good afternoon!
Good evening!
Finished
```

However, there's an even better way to do this!

## Generators as iterators

You may have seen it coming already, but that's right! Generators can also work as iterators. In practice, this means that, for example, you can use them in `for` loops.

With this knowledge, let's rewrite the last example:

```js
function* greetings() {
	yield 'morning';
	yield 'afternoon';
	yield 'night';
}

for (const greeting of greetings()) {
	console.log(`Good ${greeting}!`);
}

console.log('Finished');
```

This program, once again, outputs the following:

```
Good morning!
Good afternoon!
Good evening!
Finished
```

Looks much neater, don't you think?

## Extra: `Symbol.iterator`

Practically speaking, `Symbol.iterator` might just be the most useful application of generator functions. Basically, you can add a field with `Symbol.iterator` as its key to any object you want, where the value must be a generator function. This will let you use the object itself as an iterator! (Needless to say, it works on classes too.)

One particularly nice use case for `Symbol.iterator` is to create custom list-like data structures that you want to be able to iterate over.

For example, here's a [linked list](https://www.geeksforgeeks.org/data-structures/linked-list/), made iterable with `Symbol.iterator`:

```js
class LinkedList {
	constructor() {
		this.head = null;
	}

	push() { /* ... */}
	pop() { /* ... */}
	insert(index) { /* ... */}
	size() { /* ... */}

	[Symbol.iterator]() {
		let currentNode = this.head;

		while (currentNode !== null) {
			yield currentNode.data;
			currentNode = currentNode.next;
		}
	}
}
```

In this example, the linked list can be iterated with a `for` loop like this...

```js
const compliments = new LinkedList();

compliments.push('fun');
compliments.push('epic');
compliments.push('cool');
compliments.push('awesome');

// Nice! Iterating over all nodes...
for (const compliment of compliments) {
	console.log(`You're ${compliment}!`);
}
```

...which, of course, would produce the following output:

```
You're fun!
You're epic!
You're cool!
You're awesome!
```

Nice ;)

## Wrapping up

Thanks for sticking around to the end! We've learned what generator functions are, how they can be used as iterators, and how you can use them alongside `Symbol.iterator` to create your very own iterable objects.

I really hope you've learned something new or useful today! If not, well... feel free to suggest you'd like me to cover in the comments below! I'm always open for post ideas. 👨‍💻

Peace out!
