import { GreenScreenMethod, GreenScreenStream, GreenScreenStreamBodyPixMode } from "GreenScreenStream";

let greenscreen;
document.addEventListener("DOMContentLoaded", () => startStream(GreenScreenStreamBodyPixMode.Standard));

async function startStream(quality?: GreenScreenStreamBodyPixMode) {
    const bgfile = location.hash.length > 0 ? location.hash.replace("#", "") : "beach.jpg";
    const inStream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false });
    const track = inStream.getVideoTracks()[0];
    greenscreen = new GreenScreenStream(GreenScreenMethod.VirtualBackground, null, 640,360);
    await greenscreen.addVideoTrack(track);
    await greenscreen.initialize(`../assets/${bgfile}`, { bodyPixMode: quality });
    greenscreen.start(60);
    const outStream = greenscreen.captureStream(60); // capture result as a MediaSteam and attacj to video element
    document.querySelector("video").srcObject = outStream;
    document.querySelector(".swap").classList.remove("hide");
    window["_instance"] = greenscreen; // expose for debuging purposes
}

document.querySelectorAll(".swap-image").forEach(s => {
    s.addEventListener("click", (e) => {
        const src = (e.target as HTMLElement).dataset.src;
        greenscreen.setBackground(src);
    });
});



document.querySelectorAll(".swap-quality").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const mode: number = parseInt( (e.target as HTMLElement).dataset.mode );
        /**
         * 0 = Fast
         * 1 = Standard
         * 2 = Precise
         * 3 = Maximum
         */

        if(mode !== 3)
            return greenscreen.setBodyPixModel({ bodyPixMode: mode });

        const bConfirmed = window.confirm(
            `This setting might seriously stress your System. \n
            Loading might take a while.\n Continue?`
        );

        if(bConfirmed)
            greenscreen.setBodyPixModel({ bodyPixMode: mode });
    })
})  