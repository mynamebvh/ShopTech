const isPageCheckout = () => {
  return window.location.href.includes('checkout');
};

const renderByLocalStorage = () => {
  let data = localStorage.getItem('techCard');

  let listProduct = '';

  if (Array.isArray(JSON.parse(data))) {
    data = JSON.parse(data);

    data.forEach((e) => {
      let htmlProduct = `<li data-id=${e.id}>
      <a href="" class="sidekka_pro_img"><img src="${e.img}" alt="product"></a>
      <div class="ec-pro-content">
         <a href="/product/${e.slug}" class="cart_pro_title">${e.name}</a><span class="cart-price"><span> ${e.price} &nbsp;VND</span> x 1</span>
         <div class="qty-plus-minus">
            <div class="dec ec_qtybtn">-</div>
            <input class="qty-input" type="text" name="ec_qtybtn" value="${e.quantity}">
            <div class="inc ec_qtybtn">+</div>
         </div>
         <a href="javascript:void(0)" data-id=${e.id} class="remove">×</a>
      </div>
   </li>`;
      listProduct += htmlProduct;
    });
  }

  return listProduct;
};

const appedProduct = (img, id, name, price, quantity, slug) => {
  let data = localStorage.getItem('techCard');

  if (!data) {
    data = [];

    data.push({ img, id, name, price, quantity, slug });

    localStorage.setItem('techCard', JSON.stringify(data));
    return;
  }

  if (Array.isArray(JSON.parse(data))) {
    data = JSON.parse(data);

    let index = data.findIndex((ele) => ele.id === id);

    if (index != -1) {
      data[index].quantity = parseInt(data[index].quantity) + parseInt(quantity);
    } else {
      data.push({ img, id, name, price, quantity, slug });
    }
    localStorage.setItem('techCard', JSON.stringify(data));
  }
};

const deleteProductById = (id) => {
  let data = JSON.parse(localStorage.getItem('techCard'));

  let index = data.findIndex((pro) => pro.id == id);

  data.splice(index, 1);
  localStorage.setItem('techCard', JSON.stringify(data));
};

const changeQuantityById = (id, operator) => {
  let data = JSON.parse(localStorage.getItem('techCard'));
  let index = data.findIndex((pro) => pro.id == id);

  if (operator == '+') {
    data[index].quantity++;
  }

  if (operator == '-' && data[index].quantity > 1) {
    data[index].quantity--;
  }

  localStorage.setItem('techCard', JSON.stringify(data));

  if (isPageCheckout()) {
    document.querySelector('.ec-checkout-pro').innerHTML = renderCheckoutByLocalStorage();
    renderPriceCheckout();
  }
};

const calculatorPrice = () => {
  let data = JSON.parse(localStorage.getItem('techCard'));

  if (!data) data = [];
  let sum = data.reduce((a, b) => a + b?.price * b?.quantity, 0) || 0;
  let vat = sum * 0.08 || 0;
  let total = sum + vat || 0;
  return [sum, vat, total];
};

const renderChangePrice = (e) => {
  e('#t-price').text(calculatorPrice()[0].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
  e('#vat').text(calculatorPrice()[1].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
  e('#price').text(calculatorPrice()[2].toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
};

const renderCardNum = () => {
  let data = JSON.parse(localStorage.getItem('techCard'));

  if (!data) data = [];
  document.querySelectorAll('.cart-count-lable').forEach((ele) => {
    ele.textContent = data.length || 0;
  });
};

!(function (e) {
  renderChangePrice(e);
  renderCardNum();
  e('body').on('click', '.ec_qtybtn', function () {
    let t = e(this);

    let id = t.parent().parent().parent().attr('data-id');
    let s;
    o = t.parent().find('input').val();
    if ('+' === t.text()) {
      s = parseFloat(o) + 1;
      changeQuantityById(id, '+');
      renderChangePrice(e);
    } else if (o > 1) {
      s = parseFloat(o) - 1;
      changeQuantityById(id, '-');
      renderChangePrice(e);
    } else s = 1;
    t.parent().find('input').val(s);
  });

  e('body').on('click', '.ec-pro-content .remove', function () {
    var t = e('.eccart-pro-items li').length;
    e(this).closest('li').remove();
    deleteProductById(e(this).attr('data-id'));
    renderChangePrice(e);
    1 == t && e('.eccart-pro-items').html('<li><p class="emp-cart-msg">Giỏ hàng trống!</p></li>');
    // var o = e('.cart-count-lable').html();
    // o--;
    // e('.cart-count-lable').html(o);
    renderCardNum();
    t--;
  });

  e('.eccart-pro-items').html(renderByLocalStorage);

  e('body').on('click', '.add-to-cart', function ({ target }) {
    e('.ec-cart-float').fadeIn();

    // var t = e('.cart-count-lable').html();
    // t++;
    // e('.cart-count-lable').html(t);
    e('.emp-cart-msg').parent().remove();

    setTimeout(function () {
      e('.ec-cart-float').fadeOut();
    }, 5e3);

    let img = e(this).attr('data-img');
    let name = e(this).attr('data-name');
    let price = parseInt(e(this).attr('data-price'));
    let slug = e(this).attr('data-slug');
    let quantity = e(this).attr('data-quantity');

    // let quantity = 1;
    let id = e(this).attr('data-id');
    console.log('id', e(this).attr('data-id'));

    appedProduct(img, id, name, price, quantity, slug);
    renderChangePrice(e);
    renderCardNum();

    // let o =
    //   '<li><a href="product-left-sidebar.html" class="sidekka_pro_img"><img src="' +
    //   e(this).parents().parents().children('.image').find('.main-image').attr('src') +
    //   '" alt="product"></a><div class="ec-pro-content"><a href="product-left-sidebar.html" class="cart_pro_title">' +
    //   e(this).parents().parents().parents().children('.ec-pro-content').children('h5').children('a').html() +
    //   '</a><span class="cart-price"><span>' +
    //   e(this).parents().parents().parents().children('.ec-pro-content').children('.ec-price').children('.new-price').html() +
    //   '</span> x 1</span><div class="qty-plus-minus"><div class="dec ec_qtybtn">-</div><input class="qty-input" type="text" name="ec_qtybtn" value="1"><div class="inc ec_qtybtn">+</div></div><a href="javascript:void(0)" class="remove">×</a></div></li>';
    e('.eccart-pro-items').html(renderByLocalStorage);
  });
})(jQuery);
