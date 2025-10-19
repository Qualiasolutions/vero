"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
	const [currentVideo, setCurrentVideo] = useState(0);
	const video1Ref = useRef<HTMLVideoElement>(null);
	const video2Ref = useRef<HTMLVideoElement>(null);

	const videos = [
		"/Generated File October 19, 2025 - 2_39PM.mp4",
		"/Generated File October 19, 2025 - 2_40PM.mp4",
	];

	useEffect(() => {
		const video1 = video1Ref.current;
		const video2 = video2Ref.current;

		if (!video1 || !video2) return;

		const handleVideo1End = () => {
			setCurrentVideo(1);
			video2.currentTime = 0;
			video2.play();
		};

		const handleVideo2End = () => {
			setCurrentVideo(0);
			video1.currentTime = 0;
			video1.play();
		};

		video1.addEventListener("ended", handleVideo1End);
		video2.addEventListener("ended", handleVideo2End);

		// Start with first video
		video1.play();

		return () => {
			video1.removeEventListener("ended", handleVideo1End);
			video2.removeEventListener("ended", handleVideo2End);
		};
	}, []);

	return (
		<div className="relative aspect-video rounded-lg overflow-hidden">
			{/* Video 1 */}
			<video
				ref={video1Ref}
				muted
				playsInline
				className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
					currentVideo === 0 ? "opacity-100" : "opacity-0"
				}`}
			>
				<source src={videos[0]} type="video/mp4" />
			</video>

			{/* Video 2 */}
			<video
				ref={video2Ref}
				muted
				playsInline
				className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
					currentVideo === 1 ? "opacity-100" : "opacity-0"
				}`}
			>
				<source src={videos[1]} type="video/mp4" />
			</video>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
		</div>
	);
}
