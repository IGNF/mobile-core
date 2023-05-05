/**
 * helper class for building slider
 */
class Slider {
    /**
     * 
     * @param {JQuery} $container where to build the slider
     */
    constructor($container) {
        this.slideIndex = 1;
        this.$container = $container;

        var self = this;
        this.html = $(`<div class="slideshow-container">
            <div class="images"></div>
        </div>`);
        let $prev = $('<a class="prev">&#10094;</a>').on("click", () => {
            self.plusSlides(-1);
        });
        let $next = $('<a class="next">&#10095;</a>').on("click", () => {
            self.plusSlides(1);
        });
        this.html.append([$prev, $next]);

        this.images = [];
    }

    /**
     * initialise le slider en ajoutant le html au container
     */
    show() {
        this.$container.empty();
        this.$container.append(this.html);
        for(var i in this.images) {
            this.$container.find(".images").append(this.images[i]);
        }
        this.showSlides(1);
    }

    /**
     * Add an image slider
     * 
     * @param {String} imgUrl a valid url image
     * @param {String} legend a text to show on bottom of image
     */
    addImage(imgUrl, legend) {
        this.images.push('<div class="mySlides fade"><img src="'+imgUrl+'"><div class="text">'+legend+'</div></div>');
    }

    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }

    showSlides(n) {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let slideIndex = n;
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        
        slides[slideIndex-1].style.display = "block";
        this.slideIndex = slideIndex;
    }
}

export {Slider}