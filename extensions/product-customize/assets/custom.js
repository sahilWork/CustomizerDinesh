$(document).ready(function(){
    let tunnelUrl = 'https://f0a9-2401-4900-1c6a-2ab9-3450-568d-3a67-fed7.ngrok-free.app';
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

    function generateUniqueId() {
        const timestamp = new Date().getTime(); // Get current timestamp
        const randomNum = Math.floor(Math.random() * 1000); // Generate random number
        return `id_${timestamp}_${randomNum}`; // Create unique ID
    }

    var pathArray = window.location.pathname.split('/');
    var folder = pathArray[pathArray.length - 1];
    if (!folder) {
        console.error('No folder specified in the URL.');
        return;
    }
    var apiUrl = 'https://slateblue-goldfish-894680.hostingersite.com/custom-app/svgget.php?keyword=' + encodeURIComponent(folder);
    var baseUrl = 'https://slateblue-goldfish-894680.hostingersite.com/custom-app/'; 
    $('#loader').show(); 
    $.getJSON(apiUrl, function(data) {
        var svgSlider = $('#svg-slider');
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
            
            $('#ratingButton').show();
        } else {
            $('#ratingButton').hide(); 
        }

        const productDataDiv = $('#productData');
        productDataDiv.empty(); 

        let designs = '';
        let colors = '';

        result.products.forEach(product => {
            if (product.title.toLowerCase() === lastUrlSegment.toLowerCase()) {
                const designs = product.designs || 'N/A';
                const colors = product.colors || 'N/A'; 
               
                $('.product-design-name').html(product.title.toUpperCase());
                const designArray = designs.split(',').map(design => design.trim());
                const colorArray = colors.split(',').map(color => color.trim());
                const designHtml = designArray.map(design => `<p id="${design.toLowerCase().replace(/\s+/g, '-')}" class="designLink" link="${design.toLowerCase().replace(/\s+/g, '-')}"><img src="https://cdn.shopify.com/s/files/1/0904/5262/3636/files/decoration-add.png" class="decoration-img">${design}</p>`).join('');
                const colorHtml = colorArray.map(color => `<p id="${color.toLowerCase().replace(/\s+/g, '-')}" class="colorLink" link="${color.toLowerCase().replace(/\s+/g, '-')}">${color}</p>`).join('');
                
                productDataDiv.append(`
                    <div id="designContent" class="tabContent" style="display: none;">
                    <div class="designtabremove remove" style="cursor: pointer;"><img src="https://cdn.shopify.com/s/files/1/0904/5262/3636/files/cross.png" width="20px" height="20px" /></div>
                        <h4 style="margin: 0px; text-transform: uppercase; font-weight: bold;">Groups</h4>
                        ${designHtml}
                    </div>
                    <div id="colorContent" class="tabContent" style="display: none;">
                     <div class="colortabremove remove" style="cursor: pointer;"><img src="https://cdn.shopify.com/s/files/1/0904/5262/3636/files/cross.png" width="20px" height="20px" /></div>
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
        $('body').on('click', '.colortabremove', function(){
           $('#colorContent').hide();
           $('.menu-color').hide();
        });
        $('body').on('click', '.designtabremove', function(){
            $('#designContent').hide();
            $('.menu-design').hide();
            $('.custom-text').hide();
            $('.dynamicMine').hide();

         });
         $('body').on('click', '.menucolorremove', function(){
            $('.menu-color').hide();
         });
         $('body').on('click', '.menudesignremove', function(){
            $('.menu-design').hide();
            $('.custom-text').hide();
            $('.dynamicMine').hide();
         });
        $('#ratingButton').on('click', function() {
            $('.product').addClass('active');
            $('#ratingPopup').addClass('active');
        });

        $('#closePopup').on('click', function() {
            $('.product').removeClass('active');
            $('#ratingPopup').removeClass('active');
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

        $('#customTextName').on('input', function() {
            const userInput = $(this).val();
            let getLink = $('.designLink.active').attr('link');
            $('svg.'+getLink+' .svgText').text(userInput);  
        });

        $('body').on('click', '.logo', function() {
            var logoSrc = $(this).attr('src');
            let getLink = $('.designLink.active').attr('link');
            $('svg.'+getLink+' .custom-logo').attr('href', logoSrc);
        });
        $('body').on('click', '.btn-reset', function(){
            //color reset
            var link = $('.colorLink').attr('link');
            var getId = $('#custom-color-swatches g[link="'+link+'"]').attr('id');
            getId = getId.split('Group_')[1];
            $('svg g path').attr('fill', 'none');
            //logo reset
            var logoSrc = $('.logo').attr('src');
            let getLink = $('.designLink').attr('link');
            $('svg .custom-logo').attr('href', '');
            //text reset
            const userInput = $('#customTextName').val(); 
            $('svg .svgText').text('');  
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
            let rightSvg = '150-150-42-50';
            let leftSvg = '150-150-50-45';
            let linkData = $(this).attr('link');
            let indexGet = $('svg.'+linkData).parent().attr('data-slick-index');
            $('#svg-slider').slick('slickGoTo', indexGet);
            $('.designLink').removeClass('active'); 
            $(this).addClass('active');
            $('.menu-design').show();
            $('.custom-text').show();
            setTimeout(function(){ 
                if(linkData.indexOf('right') > -1){
                    let positions = rightSvg.split('-');
                    $('svg.'+linkData+' .custom-logo').attr('width', positions[0]);
                    $('svg.'+linkData+' .custom-logo').attr('height', positions[1]);
                    $('svg.'+linkData+' .custom-logo').attr('x', positions[2]+'%');
                    $('svg.'+linkData+' .custom-logo').attr('y', positions[3]+'%'); 
                }else if(linkData.indexOf('left') > -1){
                    let positions = leftSvg.split('-');
                    $('svg.'+linkData+' .custom-logo').attr('width', positions[0]);
                    $('svg.'+linkData+' .custom-logo').attr('height', positions[1]);
                    $('svg.'+linkData+' .custom-logo').attr('x', positions[2]+'%');
                    $('svg.'+linkData+' .custom-logo').attr('y', positions[3]+'%'); 
                }
        }, 1000);
        });
        
        $('body').on('change', '#colorPicker', function(){
            var colorName = $(this).val();
            var link = $('.colorLink.active').attr('link');
            var getId = $('#custom-color-swatches g[link="'+link+'"]').attr('id');
            getId = getId.split('Group_')[1];
            $('#Pattern_'+getId+'_000 path').attr('fill', colorName);
        });
 
        $('.color-list').on('click', '.icon-color-wrapper', function() {
            $('.icon-color-wrapper').removeClass('selected');   
            var titleColor = $(this).attr('title'); 
            $('.colour-selected-label').text(titleColor);
            $(this).addClass('selected');
            var colorName = $(this).find('.back').css('background-color');
            var link = $('.colorLink.active').attr('link');
            var getId = $('#custom-color-swatches g[link="'+link+'"]').attr('id');
            getId = getId.split('Group_')[1];
            $('#Pattern_'+getId+'_000 path').attr('fill', colorName);
        });

        $('body').on('click', '.dynamicColor a', function() {
            $('.icon-color-wrapper').removeClass('selected');   
            var titleColor = $(this).attr('title');
            $(this).addClass('selected');
            var colorName = $(this).find('.back').css('background-color');
            var link = $('.designLink.active').attr('link');
            $('svg.'+link+' .svgText').attr('fill', colorName);
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

        $('body').on('click', '.addMine', function() {
            const classes = ['.front-center', '.sleeve-left', '.back-center', '.sleeve-right'];
            const urls = [];
            let svg = '';
            let loop = 1;
            
            classes.forEach((className) => {
                if(loop == 1){
                    svg += $('svg'+className).prop('outerHTML');
                }else{
                    svg += '---'+$('svg'+className).prop('outerHTML');
                }
                loop++;
            });
           

            setTimeout(function(){
                const formdata = new FormData();
                let uniqueId = generateUniqueId();
                $('<input>').attr({
                    type: 'hidden',
                    name: 'properties[customizer_id]',
                    value: uniqueId
                }).prependTo('#customcartform');
                formdata.append("unique_id", uniqueId);
                formdata.append("svg_data", svg);
                const requestOptions = {
                  method: "POST",
                  body: formdata,
                  redirect: "follow"
                };
                
                fetch(baseUrl+"customized-svg-upload.php", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    result = JSON.parse(result);
                    let paths = result.svg_path;
                    paths.forEach((path) => {
                        let imageUrl = baseUrl + path; 
                        $('<input>').attr({
                            type: 'hidden',
                            name: 'properties[customizer_images][]', 
                            value: imageUrl
                        }).prependTo('#customcartform');
                    });
                    
                    $('#customcartform').submit();
                })
                .catch((error) => console.error(error)); 
            }, 1000);
        });
        
    });

    // const unitPrice = parseFloat(document.getElementById('unit-price').value);
    // function updateTotal() {
    //     const quantityInput = document.getElementById('quantity');
    //     let quantity = parseInt(quantityInput.value);
    //     // Ensure quantity is at least 50
    //     if (quantity < 50) {
    //         quantity = 50;
    //         quantityInput.value = 50;
    //     }
    //     const totalPrice = (unitPrice * quantity).toFixed(2);
    //     document.getElementById('total-price').innerText = `$${totalPrice}`;
    // }
    function increaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        let quantity = parseInt(quantityInput.value);
        quantity += 1;
        quantityInput.value = quantity;
        //updateTotal();
    }

    function decreaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        let quantity = parseInt(quantityInput.value);
        if (quantity > 50) {
            quantity -= 1; 
            quantityInput.value = quantity;
            //updateTotal();
        }
    }
    // Initialize total price on page load
    //updateTotal();
    function validateQuantity() {
        var qtyInput = document.getElementById('quantity');
        if (qtyInput.value < 50) {
            qtyInput.value = 50;
        }
    }