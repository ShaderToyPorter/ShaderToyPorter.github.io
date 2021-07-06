
function setup() {

    dropzone = select('#dropzone');
    dropzone.dragOver(highlight);
    dropzone.dragLeave(unHighlight);
    dropzone.drop(gotFile, unHighlight);

    const input = document.getElementById("linkInput");
    const Http = new XMLHttpRequest();

    input.onkeypress = function (e) {
        if (!e) e = window.event;
        let keyCode = e.code || e.key;
        if (keyCode === 'Enter') {
            process(input.value.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,''));
        }
    }

    function highlight() {
        dropzone.style('background-color', '#cee5d0');
    }

    function unHighlight() {
        dropzone.style('background-color', '#fff');
    }

    function gotFile(file) {

        console.log(`Got file: ${file.name}`)
        file.file.text().then(text => {
            process(text);
        });
    }

    function process(rawText){

        if (rawText.includes("iResolution")) {
            rawText = rawText.replaceAll("iResolution", "resolution");
        }
        if (rawText.includes("iTime")) {
            rawText = rawText.replaceAll("iTime", "time");
        }
        if (rawText.includes("iMouse")) {
            rawText = rawText.replaceAll("iMouse", "mouse");
        }
        if (rawText.includes("fragCoord")) {
            rawText = rawText.replaceAll("fragCoord", "gl_FragCoord");
        }
        if (rawText.includes("fragColor")) {
            rawText = rawText.replaceAll("fragColor", "gl_FragColor");
        }
        if (rawText.includes("void mainImage")) {
            console.log("cutting main");
            let cutString = rawText.substring(rawText.indexOf("void mainImage"));
            cutString = cutString.substring(0, cutString.indexOf("{"));
            rawText = rawText.replace(cutString, "void main()");
        }

        rawText = "uniform vec2 center; \n" +
            "uniform vec2 resolution;\n" +
            "uniform float time;\n" +
            "uniform vec2 mouse; \n" +
            "uniform float pulse1;\n" +
            "uniform float pulse2;\n" +
            "uniform float pulse3; \n\n\n" + rawText;
        console.log(rawText);
        let blob = new Blob([rawText], {type: 'text/plain'});
        let file = new File([blob], "menu-shader.txt", {type: "text/plain"});
        downloadFile(file, "menu-shader.fsh")

    }

    function downloadFile(file, fileName) {

        const link = document.createElement("a");
        link.style.display = "none";
        link.href = URL.createObjectURL(file);
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        // A timeout is necessary for the code to work on FireFox.
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
            link.parentNode.removeChild(link);
        }, 0);
    }
}

