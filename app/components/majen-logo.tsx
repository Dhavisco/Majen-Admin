// import { div } from "framer-motion/client";
import Image from "next/image";

export function MajenLogo() {
    return (
        // <div className="flex items-center gap-3 text-(--brand)">
        //     <span className="relative grid h-11 w-11 place-items-center">
        //         <span className="absolute h-9 w-9 rounded-full border-2 border-current opacity-20" />
        //         <span className="absolute h-7 w-7 rotate-45 rounded-[10px] border-2 border-current opacity-35" />
        //         <span className="absolute h-2.5 w-2.5 rounded-full bg-current" />
        //         <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current opacity-55" />
        //         <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current opacity-55" />
        //     </span>
        //     <span className="font-display text-[2rem] leading-none tracking-[-0.05em]">
        //         MAJEN
        //     </span>
        // </div>
        <Image
            src="/majen.svg"
            alt="Majen"
            width={166}
            height={41}
            priority
            className="h-auto w-33 sm:w-41.5"
        />
    );
}