const renderOption = async (idSelect, type, api) => {
  let data;

  switch (type) {
    case 'city':
      data = await (await fetch(api)).json();
      break;
    case 'district':
      data = (await (await fetch(api)).json()).districts;
      break;
    case 'ward':
      data = (await (await fetch(api)).json()).wards;
      break;
    default:
      break;
  }

  let options = data.map((c) => {
    return `<option value="${c.code}">${c.name}</option>`;
  });

  if (type != 'city') {
    options.splice(0, 1);
  }

  if (type == 'city') {
    options.unshift('<option value="0">Chọn thành phố</option>');
  }

  if (type == 'district') {
    options.unshift('<option value="0">Chọn quận huyện</option>');
  }

  document.getElementById(idSelect).innerHTML = options.join('');
};

const emptySelect = (id) => {
  document.getElementById(id).innerHTML = '';
};

const renderCheckoutByLocalStorage = () => {
  let data = localStorage.getItem('techCard');

  let listProduct = '';

  if (Array.isArray(JSON.parse(data))) {
    data = JSON.parse(data);

    data.forEach((e) => {
      let htmlProduct = `<div class="col-sm-12 mb-6">
      <div class="ec-product-inner">
         <div class="ec-pro-image-outer">
            <div class="ec-pro-image">
               <a href="product-left-sidebar.html" class="image">
               <img class="main-image" src="${e.img}" alt="Product">
               <img class="hover-image" src="${e.img}" alt="Product">
               </a>
               <div class="ec-pro-loader"></div>
               <div class="ec-pro-loader"></div>
            </div>
         </div>
         <div class="ec-pro-content">
            <h5 class="ec-pro-title"><a href="product-left-sidebar.html">${e.name}</a></h5>
            <div class="ec-pro-rating">
               <i class="ecicon eci-star fill"></i>
               <i class="ecicon eci-star fill"></i>
               <i class="ecicon eci-star fill"></i>
               <i class="ecicon eci-star fill"></i>
               <i class="ecicon eci-star"></i>
            </div>
            <span class="ec-price">
            <span class="new-price">${e.price} VND x ${e.quantity}</span>
            </span>
         </div>
      </div>
   </div>`;
      listProduct += htmlProduct;
    });
  }

  return listProduct;
};

const renderPriceCheckout = () => {
  const [tPrice, vat, total] = calculatorPrice();

  if (localStorage.getItem('techVoucher')) {
    const [tPrice, vat, total] = calculatorPrice();

    const { vTotal, code } = JSON.parse(localStorage.getItem('techVoucher'));
    document.getElementById('c-voucher').textContent = vTotal.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    document.getElementById('c-total').textContent = (total - vTotal).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    document.getElementById('c-voucher').textContent = vTotal.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    document.getElementById('p-price').value = (total - vTotal);
  }
  else {
    document.getElementById('c-total').textContent = total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    document.getElementById('p-price').value = total;
  }
  document.getElementById('c-price').textContent = tPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  document.getElementById('c-vat').textContent = vat.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
};

const submitForm = () => {
  const order = document.getElementById('order');

  order.addEventListener('click', async () => {
    // const fullname = document.getElementById('fullname').value;
    // const phone = document.getElementById('phone').value;

    // const methodPay = $('#ec-select-methodpay option:selected').val();
    const note = $('#ec-text-note').val();
    const order = JSON.parse(localStorage.getItem('techOrder'))
    let vTotal, code;
    if(localStorage.getItem('techVoucher')){
      voucher = JSON.parse(localStorage.getItem('techVoucher'));
      vTotal = voucher.vTotal;
      code = voucher.code;
    }

    try {
      const data = await (
        await fetch('/api/v1/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
           ...order,
            methodPay: "BANK",
            note,
            code,
            products: JSON.parse(localStorage.getItem('techCard')),
          }),
        })
      ).json();

      if (data.code == 400) {
        notif({
          msg: data.message,
          type: 'error',
          position: 'right',
          zindex: 99999999,
        });
      } else {
        // notif({
        //   msg: 'Đặt hàng thành công, nhân viên sẽ gọi điện cho bạn để xác nhận đơn hàng, Bạn sẽ được chuyển hướng sớm',
        //   type: 'success',
        //   position: 'right',
        //   zindex: 99999999,
        // });


        // localStorage.setItem('techCard', JSON.stringify([]));
        // localStorage.setItem('techOrder', JSON.stringify([]));


        renderByLocalStorage();
        document.querySelector('.ec-checkout-pro').innerHTML = renderCheckoutByLocalStorage();
        renderPriceCheckout();

        setTimeout(() => {
          window.location.href = data.data;
        }, 1000);

        // console.log(data)

      }
    } catch (error) {
      notif({
        msg: error,
        type: 'error',
        position: 'right',
        zindex: 99999999,
      });
      console.log(error);
    }
  });
};

document.addEventListener('DOMContentLoaded', async function () {
  // Logic don vi hanh chinh
  // let idCity, idDistrict;
  const selectBank = document.getElementById('ec-select-bank');
  const note = document.getElementById('ec-text-note');
  // await renderOption('ec-select-city', 'city', 'https://provinces.open-api.vn/api/p/');

  selectBank.addEventListener('change', async ({ target }) => {
    let note = "bank:" + $('#ec-select-bank option:selected').val();

    let dateNow = Date.now()

    note += "|time:"+dateNow;
    $("#ec-text-note").val(note);
    
  })
   

  //   await renderOption('ec-select-district', 'district', `https://provinces.open-api.vn/api/p/${idCity}?depth=2`);
  // });

  // document.getElementById('ec-select-district').addEventListener('change', async ({ target }) => {
  //   idDistrict = target.value;
  //   emptySelect('ec-select-ward');

  //   await renderOption('ec-select-ward', 'ward', `https://provinces.open-api.vn/api/d/${idDistrict}?depth=2`);
  // });

  // render product by localstorage
  document.querySelector('.ec-checkout-pro').innerHTML = renderCheckoutByLocalStorage();

  renderPriceCheckout();

  submitForm();
});
