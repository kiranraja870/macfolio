import React, { useRef } from 'react';
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, base: 100 },
    title: { min: 400, max: 900, base: 400 },
};
const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
};

const setupTextHover = (container, type) => {
    if (!container) return;
    const letters = container.querySelectorAll("span");
    const { min, max, base } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter,{
            duration,
            ease:'power2.out',
            fontVariationSettings: `'wght' ${weight}`,
        });
    };
    const handleMouseLeave = () => {
        letters.forEach((letter) => {
            animateLetter(letter, base, 0.3);
        });
    };
    const handleMouseMove = (e) => {

        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter) => {
            const{left : l,width :w} = letter.getBoundingClientRect();
            const distance = Math.abs (mouseX -(l - left + w/2));
            const intensity = Math.exp(-(distance ** 2) /2000 );

            animateLetter(letter, min +(max - min)* intensity);
        });
    };
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    };
};

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current, "title");
        const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            if (titleCleanup) titleCleanup();
            if (subtitleCleanup) subtitleCleanup();
        };
    },[]);

    return (
        <section id="welcome">
            <p ref={subtitleRef}>
                {renderText("Hey, I'm Kiran Raja! Welcome to my", 'text-3xl font-georama', 100)}
            </p>
            <h1 ref={titleRef} className="mt-7">
                {renderText("portfolio",'text-9xl italic font-georama', 400)}
            </h1>

            <div className="small-screen">
                <p className="text-[16px] text-center font-roboto text-gray-400">
                    This Portfolio is designed for desktop/tablet screen only
                </p>
            </div>
        </section>
    );
};

export default Welcome;