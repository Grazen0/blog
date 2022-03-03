import { NextPage } from 'next/types';
import Layout from 'components/layout/Layout';
import PostImage from 'components/post/PostImage';
import AnimatedLink from 'components/AnimatedLink';

const About: NextPage = () => (
	<Layout title="About">
		<main className="p-6 leading-relaxed text-xl">
			<h1 className="text-5xl text-center font-bold my-8">About</h1>
			<div className="centered-2xl my-10">
				<p className="my-8">
					Hi! My name is José Grayson, but you probably know me as ElCholoGamer. I&apos;m some
					15-year old who likes to code a lot. For the past 2-3 years I&apos;ve been experimenting
					and tinkering with lots of different programming projects like Minecraft plugins, Discord
					bots, Terraria mods, and more. However, my main focus is, by far, web development.
				</p>
				<p className="my-8">
					My preferred programming language is TypeScript, but I can also do some stuff with Java
					and C#. Currently learning Rust, too 🦀.
				</p>
				<p className="my-8">
					I&apos;m making this blog because I want to share my knowledge about coding and software
					development, and possibly help someone along their programming journey. There&apos;s lots
					of things I would&apos;ve wanted to know as I learned things, so you could take this blog
					as a really big{' '}
					<span className="italic">
						&quot;What I wish I&apos;d have known when I learned X&quot;
					</span>
					.
				</p>
				<p className="my-8">
					Oh yeah, I have a cute cat! Hold on a second, she&apos;s trying to get onto my desk right
					now.
				</p>
				<PostImage src="/img/my_cat.jpg" alt="She's really lazy, by the way." />

				<p className="mt-0">Alright, she&apos;s gone.</p>

				<h2 className="font-semibold text-3xl mt-10 mb-5">Some stuff about me:</h2>
				<ul className="pl-8">
					<li>- 🤺 Fencer</li>
					<li>- ⭐ Avid Star Wars fan</li>
					<li>- 📺 Anime enthusiast</li>
					<li>- 👾 Love retro video-games</li>
				</ul>

				<h2 className="font-semibold text-3xl mt-14 mb-4">Contact me</h2>
				<p className="my-8">
					You can find me on{' '}
					<AnimatedLink href="https://github.com/ElCholoGamer/" className="text-blue-400">
						GitHub
					</AnimatedLink>
					,{' '}
					<AnimatedLink
						href="https://www.youtube.com/channel/UClmqXQiLYfIrvQKfr40nMyg"
						className="text-blue-400"
					>
						YouTube
					</AnimatedLink>
					, and{' '}
					<AnimatedLink href="https://twitter.com/ElCholoGamer" className="text-blue-400">
						Twitter
					</AnimatedLink>
					. Also, feel free to reach out to me on Discord as{' '}
					<span className="font-semibold">ElCholoGamer#8225</span>.
				</p>
			</div>
		</main>
	</Layout>
);

export default About;
