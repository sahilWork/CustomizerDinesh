$(document).ready(function(){
    let tunnelUrl = 'https://9ea7-2405-201-5004-7835-19df-1540-c511-4132.ngrok-free.app';

    function fetchSVG(url, container) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('image/svg+xml'); 
        xhr.onload = function() {
            if (xhr.status === 200) {
                var svg = xhr.responseXML.documentElement;
                var slide = $('<div>').append(svg); 
                container.append(slide); 
            } else {
                console.log('Failed to load SVG: ' + url);
            }
        };
        xhr.send();
    }
    function sideBarSend(url, takeName) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('image/svg+xml'); 
        xhr.onload = function() {
            if (xhr.status === 200) {
                var svg = xhr.responseXML.documentElement;
                var slide = $('#colorContent #'+takeName).prepend(svg); 
            } else {
                console.log('Failed to load SVG: ' + url);
            }
        };
        xhr.send();
    }

    var pathArray = window.location.pathname.split('/');
    var folder = pathArray[pathArray.length - 1];
        
    if (!folder) {
        console.error('No folder specified in the URL.');
        return;
    }

    var apiUrl = 'https://slateblue-goldfish-894680.hostingersite.com/custom-app/svgget.php?keyword=' + encodeURIComponent(folder);
    var baseUrl = 'https://slateblue-goldfish-894680.hostingersite.com/custom-app/'; 
    
    // Show the loader before starting the API call
    $('#loader').show(); 
    
    $.getJSON(apiUrl, function(data) {
        var svgSlider = $('#svg-slider');
        
        // Hide the loader once we receive the response
        $('#loader').hide(); 

        if (data.error) {
            console.error(data.error);
            return;
        }

        // Append main folder SVGs
        if (data.main_folder && data.main_folder.length > 0) {

            data.main_folder.forEach(function(svgFile) {
                var fullUrl = baseUrl + folder + '/' + svgFile;
                console.log(fullUrl);
                fetchSVG(fullUrl, svgSlider);
            });
        }

        // Append sidebar SVGs
        if (data.sidebar && data.sidebar.length > 0) {
            data.sidebar.forEach(function(svgFile) {
                var fullUrl = baseUrl + folder + '/Sidebar/' + svgFile;
                var takeName = svgFile.split('.')[0];
                sideBarSend(fullUrl, takeName);
            });
        }

        // Initialize the slider after all SVGs are loaded
        setTimeout(function() {
            svgSlider.slick({
                dots: true,            
                infinite: true,        
                slidesToShow: 1,       
                slidesToScroll: 1,     
                prevArrow: '<button class="slick-prev">←</button>', 
                nextArrow: '<button class="slick-next">→</button>'  
            });
        }, 1500); 
    }).fail(function() {
        // Hide the loader in case of error
        $('#loader').hide(); 
        console.error('Failed to fetch SVG data.');
    });

    

    let handlepro = '{{ product.handle }}';
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ /* Your request payload here */ }), 
        redirect: "follow"
    };

    fetch(tunnelUrl+"/api/frontendgetpro", requestOptions)
        .then((response) => response.json())
        .then((result) => {
        const lastUrlSegment = window.location.pathname.split('/').pop(); 
        const productTitles = result.products.map(product => product.title); 
        const isMatch = productTitles.includes(lastUrlSegment);

        if (isMatch) {
            $('#ratingButton').show(); // Show the button
        } else {
            $('#ratingButton').hide(); // Hide the button
        }

        const productDataDiv = $('#productData');
        productDataDiv.empty(); // Clear previous content

        let designs = '';
        let colors = '';

        result.products.forEach(product => {
            if (product.title.toLowerCase() === lastUrlSegment.toLowerCase()) {
                const designs = product.designs || 'N/A';
                const colors = product.colors || 'N/A';
                
                // Splitting the designs and colors by commas
                const designArray = designs.split(',').map(design => design.trim());
                const colorArray = colors.split(',').map(color => color.trim());
                
                
                // Creating the HTML for designs and colors
                const designHtml = designArray.map(design => `<p id="${design.toLowerCase().replace(/\s+/g, '-')}" class="designLink" link="${design.toLowerCase().replace(/\s+/g, '-')}">${design}</p>`).join('');
                const colorHtml = colorArray.map(color => `<p id="${color.toLowerCase().replace(/\s+/g, '-')}" class="colorLink" link="${color.toLowerCase().replace(/\s+/g, '-')}">${color}</p>`).join('');
                
                productDataDiv.append(`
                    <div id="designContent" class="tabContent" style="display: none;">
                        <h4 style="margin: 0px; text-transform: uppercase; font-weight: bold;">Groups</h4>
                        ${designHtml}
                    </div>
                    <div id="colorContent" class="tabContent" style="display: none;">
                        <h4 style="margin: 0px; text-transform: uppercase; font-weight: bold;">Groups</h4>
                        ${colorHtml}
                    </div>
                `);
            }
        });
        })
        .catch((error) => console.error(error));

        const requestOptions2 = {
        method: "GET",
        redirect: "follow"
        };

        $('#ratingButton').on('click', function() {
            $('.product').addClass('active');
            $('#ratingPopup').show();
        });

        $('#closePopup').on('click', function() {
            $('.product').removeClass('active');
            $('#ratingPopup').hide();
        });

        $('#designTab').on('click', function() {
            $('.custom-text').hide();
            $('.menu-color').hide();
            $('#designContent').show();
            $('#colorContent').hide();
            $(this).css('color', '#fff');
            $('#colorTab').css('color', '#b3b3b3');
        });

        $('#colorTab').on('click', function() {
            $('.custom-text').hide();
            $('.menu-design').hide();
            $('#designContent').hide();
            $('#colorContent').show();
            $(this).css('color', '#fff');
            $('#designTab').css('color', '#b3b3b3');
        });

        $('#downloadImage').on('click', function() {
            var svgElement = document.getElementById('R1071_Hoodie_Front_A');
     
        });

        $('#colorPickertext').on('input', function() {
            var selectedColor = $(this).val();
            let getLink = $('.designLink.active').attr('link');
            $('svg.'+getLink+' .svgText').attr('fill', selectedColor);
        });

        $('#textInput').on('input', function() {
            const userInput = $(this).val();
            let getLink = $('.designLink.active').attr('link');
            $('svg.'+getLink+' .svgText').text(userInput);  
        });

        $('body').on('click', '.logo', function() {
            var logoSrc = $(this).attr('src');
            let getLink = $('.designLink.active').attr('link');
            $('svg.'+getLink+' .custom-logo').attr('href', logoSrc);
        });

        $('body').on('click', '.logo-list .section-title', function(){
            $('.logo-list .section-title').removeClass('active');
            $(this).addClass('active');
            let getLink = $(this).attr('link');
            $('.dynamicMine').hide();
            $('.'+getLink).show();
        });

        $('body').on('click', '#front-center', function() {
            $('#svgText').attr('x', "50%"); 
            $('#svgText').attr('y', "60%"); 
            $(".custom-logo").show(); 
            $(".custom-logo").attr('x', "46%"); 
            $(".custom-logo").attr('y', "45%"); 
            $('.custom-logo').attr('width', "200"); 
            $('.custom-logo').attr('height', "200"); 
        });

        $('body').on('click', '#sleeve-left', function() {
            $('#svgText').attr('x', "50%"); 
            $('#svgText').attr('y', "60%"); 
            $(".custom-logo").show(); 
            $(".custom-logo").attr('x', "46%"); 
            $(".custom-logo").attr('y', "45%"); 
            $('.custom-logo').attr('width', "200"); 
            $('.custom-logo').attr('height', "200"); 
        });
        $('body').on('click', '#sleeve-right', function() {
            $('#svgText').attr('x', "50%"); 
            $('#svgText').attr('y', "60%"); 
            $(".custom-logo").show(); 
            $(".custom-logo").attr('x', "46%"); 
            $(".custom-logo").attr('y', "45%"); 
            $('.custom-logo').attr('width', "200"); 
            $('.custom-logo').attr('height', "200"); 
        });
        $('body').on('click', '#back-center', function() {
            $('#svgText').attr('x', "50%"); 
            $('#svgText').attr('y', "60%"); 
            $(".custom-logo").show(); 
            $(".custom-logo").attr('x', "46%"); 
            $(".custom-logo").attr('y', "45%"); 
            $('.custom-logo').attr('width', "200"); 
            $('.custom-logo').attr('height', "200"); 
        });

        $('body').on('click', '.colorLink', function(){
            $('.colorLink').removeClass('active'); 
            $(this).addClass('active');
            $('.menu-color').show();
            $('.menu-design').hide();
            let getType = $(this).attr('link');
            var getColor = $('#svg-slider .slick-slide.slick-active svg g[link="'+getType+'"] g:last path').attr('fill');
            $('.color-list .icon-color-wrapper').removeClass('selected');
            let titleName =  $('.color-list .back[style="background: '+getColor+';"]').parent().attr('title');
            console.log(titleName);
            $('.selectedColor .colour-selected-label').text(titleName);
            $('.color-list .back[style="background: '+getColor+';"]').parent().addClass('selected'); 
        });

        $('body').on('click', '.designLink', function(){
            $('.designLink').removeClass('active'); 
            $(this).addClass('active');
            $('.menu-design').show();
            $('.custom-text').show();
        });

        $('body').on('change', '#colorPicker', function(){
            var colorName = $(this).val();
            var link = $('.colorLink.active').attr('link');
            var getId = $('#custom-color-swatches g[link="'+link+'"]').attr('id');
            getId = getId.split('Group_')[1];
            $('#Pattern_'+getId+'_000 path').attr('fill', colorName);
        });

        $('.color-list').on('click', '.icon-color-wrapper', function() {
            // Remove selected class from all and add to the clicked one
            $('.icon-color-wrapper').removeClass('selected');
            var titleColor = $(this).attr('title'); 
            $('.colour-selected-label').text(titleColor);
            $(this).addClass('selected');

            // Get the background color of the selected swatch
            var colorName = $(this).find('.back').css('background-color');

            // Assuming you have a way to get the correct link
            var link = $('.colorLink.active').attr('link');
            var getId = $('#custom-color-swatches g[link="'+link+'"]').attr('id');
            getId = getId.split('Group_')[1];

            // Change the fill color of the SVG path
            $('#Pattern_'+getId+'_000 path').attr('fill', colorName);
        });

        jQuery('product-info .product__info-wrapper button#ratingButton').click(function() {
            if(jQuery('product-info .page-width .product').hasClass('active')){
                jQuery('div.shopify-section.announcement-bar-section').hide();
                jQuery('div.shopify-section.section-header').hide();
            }else{
                jQuery('div.shopify-section.announcement-bar-section').show();
                jQuery('div.shopify-section.section-header').show();
            }
        });

        jQuery('product-info .product__info-wrapper div#ratingPopup button#closePopup').click(function() {
            if(jQuery('product-info .page-width .product').hasClass('active')){
                jQuery('div.shopify-section.announcement-bar-section').hide();
                jQuery('div.shopify-section.section-header').hide();
            }else{
                jQuery('div.shopify-section.announcement-bar-section').show();
                jQuery('div.shopify-section.section-header').show();
            }
        });
    });