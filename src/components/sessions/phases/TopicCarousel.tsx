
import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface TopicSlide {
    title: string;
    score: number;
    content: string;
    trend?: string;
}

interface TopicCarouselProps {
    slides: TopicSlide[];
}

export default function TopicCarousel({ slides }: TopicCarouselProps) {
    return (
        <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
                {slides.map((slide, index) => (
                    <CarouselItem key={index}>
                        <div className="bg-yellow-50 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">{slide.title}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-orange-600">{slide.score.toFixed(1)}</span>
                                    <span className="text-sm text-gray-600">/10</span>
                                </div>
                            </div>
                            <p className="text-gray-700">{slide.content}</p>
                            {slide.trend && (
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Trend:</span>
                                    <span className="font-medium text-orange-600">{slide.trend}</span>
                                </div>
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white -left-4" />
            <CarouselNext className="bg-white -right-4" />
        </Carousel>
    );
}
