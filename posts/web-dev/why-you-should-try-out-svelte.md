---
title: Why You Should Try Out Svelte
summary: A look at a very particular JavaScript framework
date: 12/03/2022
image: /img/web-dev/why_you_should_try_out_svelte.png
image_alt: Made for success.
---

Ah, JavaScript frameworks. We all love and hate them. A wise man once said: "Every day, a new JS framework is born".

I mean, it's obviously not true in the literal sense, but you get the idea.

In-between the huge JS frameworks ecosystem, you may have already heard of [Svelte](https://svelte.dev/). This guy has been around for about 6 years now, but it's relatively unknown in relation to the huge communities that the big frameworks like React, Vue, and Angular have.

Quick intro: Svelte is similar to other JS frameworks in the fact that it provides you an API to build reusable components. As such, it has many features inherent to the concept, such as component props and state. However, its big difference is that, instead of being a library you import from your front-end application, Svelte is in fact a **compiler**! It, well, _compiles_ your app into code that surgically updates the DOM with little to no overhead. You can read more about this amazing framework [here](https://en.wikipedia.org/wiki/Svelte).

Now, I've always been a React guy, mostly because it was the first JS framework I ever learned. Its simplicity and ease of use have always had me hooked in. In fact, this very blog was made with [Next.js](https://nextjs.org/), a framework built on top of React.

Given this, I got pretty interested when I read about Svelte, and how it worked differently from traditional frameworks.

So I gave Svelte a try. And it was great! Let's see why.

## The Reasons

### ⚡ Great Performance

This is one of Svelte's main strenghts. As I mentioned before, Svelte differs from other frameworks due to the fact that it does most of the bulk of its work at compile-time, allowing it to produce optimized production-ready code. This is great both for developers _and_ users: It lets us use the powerful abstractions provided by the framework, and builds a fast and efficient bundle, improving end-user experience.

![It's fast!](/img/guy_running.gif)

### 🧱 Minimal Boilerplate

One of the advantages of Svelte I noticed almost right away is the little amount of boilerplate needed. Let's take a look at a simple Svelte component:

```html
<h1>Hello, world!</h1>
```

Guess what? This is a valid Svelte component that renders a heading! Compare this to what its react counterpart might look like:

```jsx
import React from 'react';

function MyComponent() {
	return <h1>Hello, world!</h1>;
}

export default MyComponent;
```

As we can see, Svelte requires less boilerplate code in general, which tends to be a pretty good productivity boost.

Apart from code quantity, I'd like to point out how much less verbose Svelte is in comparison to React. We'll get a bit more into this later, but extra words such as the `MyComponent` function declaration, the `React` import, and the component export add an extra layer of verbosity to our code, which can distract us developers from what the code is actually doing. Well, of course this isn't really an issue with a component as simple as this, but it can get a bit messy with large files.

### 🔥 Ridiculously Simple Reactivity

In Svelte, using state is as simple as declaring a variable! To update the state, simply modify the variable as you would in vanilla JS.

```html
<script>
	let count = 0;

	function handleClick() {
		count++;
	}

	$: doubleCount = count * 2; // Will update when count changes
</script>

<p>Count: {count}</p>
<p>Count times two: {doubleCount}</p>
<button on:click="{handleClick}">Click me!</button>
```

It's so simple even a kid can do it!

![(Maybe not a kid...)](/img/kid_falling.gif)

This also complements my previous point about Svelte using minimal boilerplate. I'm really amazed at how stupid simple it is to include state and reactivity in a component! Again, yet another productivity boost.

### 🏪 Built-In Stores

Svelte has a feature called **stores**, which lets you extract state out of the component hierarchy, thus allowing multiple unrelated components to access said state. As with similar solutions in other frameworks, this mainly helps avoid prop drilling.

```js
// stores.js
import { writable } from 'svelte/store';

export const lang = writable('en');
```

```html
<!-- App.svelte -->
<script>
	import { lang } from './stores.js';
</script>

<p>Selected language: {$lang}</p>
<select bind:value="{$lang}">
	<option value="en">English</option>
	<option value="es">Español</option>
</select>
```

There are other types of stores, such as readables, derived, and even custom ones!

Having all of this work with zero configuration really is a huge advantage. I don't need to include some full-blown state management library like Redux; it just works out of the box.

## So, in conclusion...

You _should_ definitely try out Svelte. It has a lot of interesting features that make it stand out from other frameworks, and it innovates in many areas of modern front-end development.

It's not hard at all to get started either! I recommend checking out the online [Svelte tutorial](https://svelte.dev/tutorial/). It has an interactive code editor with live preview which you can use to experiment without leaving your browser!

![Wink](/img/harry_wink.gif)

By the way, this post doesn't mean to say that Svelte is the one superior framework, nor that other ones are trash. I used comparisons for the sake of, well, comparing how things work in different frameworks. I'm still a huge fan of React, and I look forward to its future as well.

Right, that's all for this post. See ya!
