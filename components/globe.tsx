"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useSpring } from "react-spring";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }));
  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2.1,
      width: width * 3,
      height: width * 3,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1,
      baseColor: [3, 6, 9],
      markerColor: [251 / 255, 100 / 255, 255 / 255],
      glowColor: [1.2, 1.2, 1.2],
      opacity: 0.81,
      markers: [
        { location: [37.7595, -122.4367], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [48.8566, 2.3522], size: 0.1 }, // Paris
        { location: [52.52, 13.405], size: 0.1 }, // Berlin
        { location: [41.9028, 12.4964], size: 0.1 }, // Rome
        { location: [40.4168, -3.7038], size: 0.1 }, // Madrid
        { location: [50.1109, 8.6821], size: 0.1 }, // Frankfurt
        { location: [51.5074, -0.1278], size: 0.1 }, // London
        { location: [48.1351, 11.582], size: 0.1 }, // Munich
        { location: [45.4642, 9.19], size: 0.1 }, // Milan
        { location: [59.3293, 18.0686], size: 0.1 }, // Stockholm
        { location: [55.6761, 12.5683], size: 0.1 }, // Copenhagen
        { location: [53.3498, -6.2603], size: 0.1 }, // Dublin
        { location: [52.2297, 21.0122], size: 0.1 }, // Warsaw
        { location: [47.4979, 19.0402], size: 0.1 }, // Budapest
        { location: [50.0755, 14.4378], size: 0.1 }, // Prague
        { location: [60.1695, 24.9354], size: 0.1 }, // Helsinki
        { location: [38.7223, -9.1393], size: 0.1 }, // Lisbon
        { location: [48.2082, 16.3738], size: 0.1 }, // Vienna
        { location: [37.9838, 23.7275], size: 0.1 }, // Athens
        { location: [59.9139, 10.7522], size: 0.1 }, // Oslo
        { location: [55.7558, 37.6173], size: 0.1 }, // Moscow
        // Asia
        { location: [35.6895, 139.6917], size: 0.1 }, // Tokyo
        { location: [31.2304, 121.4737], size: 0.1 }, // Shanghai
        { location: [28.6139, 77.209], size: 0.1 }, // Delhi
        { location: [39.9042, 116.4074], size: 0.1 }, // Beijing
        { location: [19.076, 72.8777], size: 0.1 }, // Mumbai
        { location: [13.7563, 100.5018], size: 0.1 }, // Bangkok
        { location: [1.3521, 103.8198], size: 0.1 }, // Singapore
        { location: [37.5665, 126.978], size: 0.1 }, // Seoul
        { location: [14.5995, 120.9842], size: 0.1 }, // Manila
        { location: [22.3964, 114.1095], size: 0.1 }, // Hong Kong
        { location: [13.0827, 80.2707], size: 0.1 }, // Chennai
        { location: [24.8607, 67.0011], size: 0.1 }, // Karachi
        // USA
        { location: [34.0522, -118.2437], size: 0.1 }, // Los Angeles
        { location: [41.8781, -87.6298], size: 0.1 }, // Chicago
        { location: [29.7604, -95.3698], size: 0.1 }, // Houston
        { location: [33.4484, -112.074], size: 0.1 }, // Phoenix
        { location: [29.4241, -98.4936], size: 0.1 }, // San Antonio
        { location: [32.7157, -117.1611], size: 0.1 }, // San Diego
        { location: [32.7767, -96.797], size: 0.1 }, // Dallas
        { location: [37.7749, -122.4194], size: 0.1 }, // San Francisco
        { location: [47.6062, -122.3321], size: 0.1 }, // Seattle
        { location: [39.7392, -104.9903], size: 0.1 }, // Denver
        // Africa
        { location: [30.0444, 31.2357], size: 0.1 }, // Cairo
        { location: [-1.2921, 36.8219], size: 0.1 }, // Nairobi
        { location: [6.5244, 3.3792], size: 0.1 }, // Lagos
        { location: [-26.2041, 28.0473], size: 0.1 }, // Johannesburg
        { location: [5.6037, -0.187], size: 0.1 }, // Accra
        { location: [34.5553, 69.2075], size: 0.1 }, // Kabul
        { location: [36.8219, -1.2921], size: 0.1 }, // Nairobi
        // South America
        { location: [-34.6037, -58.3816], size: 0.1 }, // Buenos Aires
        { location: [-22.9068, -43.1729], size: 0.1 }, // Rio de Janeiro
        { location: [-23.5505, -46.6333], size: 0.1 }, // São Paulo
        { location: [-12.0464, -77.0428], size: 0.1 }, // Lima
        { location: [-33.4489, -70.6693], size: 0.1 }, // Santiago
        { location: [-4.2105, -69.9356], size: 0.1 }, // Manaus
        { location: [-16.5, -68.15], size: 0.1 }, // La Paz
        { location: [-0.1807, -78.4678], size: 0.1 }, // Quito
        { location: [10.4806, -66.9036], size: 0.1 }, // Caracas
        // Russia
        { location: [55.7558, 37.6173], size: 0.1 }, // Moscow
        { location: [59.9343, 30.3351], size: 0.1 }, // Saint Petersburg
      ],
      onRender: (state) => {
        // This prevents rotation while dragging
        if (!pointerInteracting.current) {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          phi += 0.005;
        }
        state.phi = phi + r.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });
    setTimeout(() => (canvasRef.current!.style.opacity = "1"));
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);
  interface GlobeProps {}

  interface PointerEventHandlers {
    onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
    onPointerUp: () => void;
    onPointerOut: () => void;
    onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  }

  const pointerEventHandlers: PointerEventHandlers = {
    onPointerDown: (e) => {
      pointerInteracting.current =
        e.clientX - pointerInteractionMovement.current;
      canvasRef.current!.style.cursor = "grabbing";
    },
    onPointerUp: () => {
      pointerInteracting.current = null;
      canvasRef.current!.style.cursor = "grab";
    },
    onPointerOut: () => {
      pointerInteracting.current = null;
      canvasRef.current!.style.cursor = "grab";
    },
    onMouseMove: (e) => {
      if (pointerInteracting.current !== null) {
        const delta = e.clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta;
        api.start({
          r: delta / 200,
        });
      }
    },
    onTouchMove: (e) => {
      if (pointerInteracting.current !== null && e.touches[0]) {
        const delta = e.touches[0].clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta;
        api.start({
          r: delta / 100,
        });
      }
    },
  };

  return (
    <div className='right-auto md:right-3 z-[12] absolute m-auto w-full max-w-[600px] aspect-square scale-90'>
      <canvas
        ref={canvasRef}
        {...pointerEventHandlers}
        className='opacity-0 size-full transition-opacity cursor-grab contain-size contain-layout contain-paint'
      />
    </div>
  );
}
