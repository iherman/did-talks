
/**
 * The problem: figures in SVG may not print properly when converting the slides to
 * PDF.
 * 
 * This function considers two classes for `figure`: `svg` and `svg_print`. The
 * function switches on/off the relevant elements in the DOM depending on
 * whether the URL of the slides is using the reveal.js printing trick.
 */
function switch_svg_png() {
    // Alternate images with SVG files for PDF print; the handling of SVG seems to create problems (new pages, for example)
    let query = window.location.search.match( /print-pdf/gi ) ? 'figure.svg' : 'figure.svg_print';
    document.querySelectorAll(query).forEach((item) => {
            item.parentNode.removeChild(item);
    });
}

/**
 * Add a small downward arrows to subsection 'headers', identified by the class `subsection`
 */
function add_section_arrow() {
    document.querySelectorAll('section.subsection').forEach((item) => {
        let figure = document.createElement('figure');
        figure.innerHTML = '<a href="#" class="navigate-down"><img width="30" data-src="../../assets/images/arrow.png" alt="Down arrow"></a>';
        figure.setAttribute('style','position: absolute; top:690px; left:625px');
        item.appendChild(figure); 
    });    
}


/**
 * Setting fancier backgrounds, overwriting the css settings.
 * 
 * The input is an object with the following fields
 * - logo_width: Width of the logo to be displayed on the top right corner; the vertical band will be adjusted accordingly
 * - logo_url: URL of the logo to be displayed; preference for an SVG logo. URL is relative to the talk HTML file!
 * - basic_color: The color setting for the top level slides
 * - alt_color_1: The color setting of the 1st, 3rd, 5th, etc, subsection slides
 * - alt_color_2: The color setting of the 2nd, 4th, 6th, etc, subsection slides
 * 
 * @param {Object} settings - object with the possible settings
 */
function advanced_background_setting(settings) {
    const background_logo   = `top 10px right 15px url(${settings.logo_url}) no-repeat`;
    const right_band        = `bottom right / ${2*15 + settings.logo_width}px 100% linear-gradient(hsl(211, 45%, 25%), hsl(205, 42%, 92%)) no-repeat`;
    const common_background = `${background_logo},${right_band}`;
    const background_attribute = 'data-background';
    
    const slides = document.querySelector('div.slides');
    slides.querySelectorAll('section').forEach( (slide) => {
        if (slide.hasAttribute(background_attribute) === false) {
            slide.setAttribute(background_attribute,`${common_background}, ${settings.basic_color}`);
        }
    });

    // Slides in a section get a different background color (except for the section heading)
    const subsections = document.querySelectorAll('section.subsection');
    let odd = true;
    // A 'subsection' is a series of slides between two slides that are marked as 'subsections'
    subsections.forEach((subsection) => {
        let color = odd ? settings.alt_color_1 : settings.alt_color_2;
        odd = !odd;
        let nextSlide = subsection.nextSibling;
        while(nextSlide !== null) {
            if (nextSlide.tagName === 'SECTION') {
                const classes = nextSlide.className.split(' ');
                if (classes.includes('subsection')) {
                    // next subsection begins; stop this one
                    return;
                } else if (classes.includes('not_in_subsection')) {
                    // this is a top level slide although does not start a new subsection
                    return;
                } else {
                    nextSlide.setAttribute(background_attribute,`${common_background}, ${color}`);
                }
            } 
            nextSlide = nextSlide.nextSibling;
        }
    })
}
