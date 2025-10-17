import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            width={props.width || "32"}
            height={props.height || "32"}
            {...props}
        >
            <path
                fill="hsl(var(--primary))"
                d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"
            />
            <path
                fill="hsl(var(--primary))"
                d="M173.34 94.66a8 8 0 0 1-11.32 0L139.3 72H116.7l-22.72 22.66a8 8 0 0 1-11.32-11.32l28.38-28.38a8 8 0 0 1 5.66-2.34H144a8 8 0 0 1 5.66 2.34l23.68 23.68a8 8 0 0 1 0 11.32ZM152 144h-48a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8Z"
            />
        </svg>
    );
}
