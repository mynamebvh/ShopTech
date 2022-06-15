function updateData() {
  $('#file-datatable').DataTable().ajax.reload();
}

const loadOrders = () => {
  const api = '/api/v1/orders?sortBy=createdAt:desc';
  var table = $('#file-datatable').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: api,
      dataSrc: function (json) {
        const result = json.data.map((data) => {
          let method = null;

          method = ` 
            <button type="button" class="btn btn-primary" id="btnEdit" data-bs-toggle="modal" data-bs-target="#update-modal"><i class="fas fa-eye"></i> Xem chi tiết</button>
                                            
            <button type="button" class="btn btn-secondary" id="btnDelete" data-bs-toggle="modal" data-bs-target="#modaldemo2"><i class="fas fa-eye-slash"></i></i> Huỷ</button>`;

          return { ...data, method };
        });

        return result;
      },
    },

    columns: [
      { data: null, defaultContent: '', className: 'sttColumn' },
      {
        data: 'fullname',
      },
      { data: 'address' },
      { data: 'phone' },

      { data: 'methodPay' },
      {
        data: 'status',
        render: function (data, type, row) {
          if (data == 'Xác nhận') {
            return `<span class='text-info tx-bold'>${data}</span>`;
          } else if (data == 'Chờ xác nhận') {
            return `<span class='text-warning tx-bold'>${data}</span>`;
          } else if (data == 'Huỷ bỏ') {
            return `<span class='text-secondary tx-bold'>${data}</span>`;
          }else {
            return `<span class='text-info tx-bold'>${data}</span>`;
          }
        },
      },

      { data: 'method' },
    ],
    columnDefs: [
      // {
      //   targets: 2,
      //   width: '5%',
      //   render: function (data, type, row) {
      //     return data.substr(0, 30) + '...';
      //   },
      // },
      {
        targets: 6,
        width: '10%',
      },
    ],
    fnRowCallback: function (nRow, aData, iDisplayIndex) {
      var oSettings = this.fnSettings();
      $('td:first', nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
      return nRow;
    },

    language: {
      sProcessing: 'Đang xử lý...',
      sLengthMenu: 'Chọn số bản ghi hiển thị trên một trang _MENU_ bản ghi',
      sZeroRecords: 'Không có dữ liệu để hiển thị.',
      sInfo: 'Hiển thị từ _START_ đến _END_ trong tổng số _TOTAL_',
      sInfoEmpty: 'Hiển thị từ 0 đến 0 trong tổng số 0 mục',
      sInfoFiltered: '(được lọc từ _MAX_ bản ghi)',
      sInfoPostFix: '',
      sSearch: 'Tìm kiếm:',
      sUrl: '',
      oPaginate: {
        sFirst: 'Đầu',
        sPrevious: 'Trước',
        sNext: 'Tiếp',
        sLast: 'Cuối',
      },
    },
  });
};

const viewDetailOrder = () => {
  $('#file-datatable tbody').on('click', 'button#btnEdit', async function () {
    order = $('#file-datatable').DataTable().row($(this).parents('tr')).data();

    $('#fullname').val(order.fullname);
    $('#address').val(order.address);
    $('#phone').val(order.phone);
    $('#status').val(order.status);
    $('#method-pay').val(order.methodPay);
    $('#txnRef').val(order.txnRef);
    $('#note').val(order?.note);

    const data = await (await fetch(`/api/v1/order-detail/${order.id}`)).json();
    let products = data.data.products;
    const total = (data.data.total)
    $('#t-total').text((total).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
    $('#voucher').text((data.data.discount).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
    $('#total').text((total - data.data.discount ).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));


    const divRender = document.getElementById('r-products');
    products = products.map((p) => {
      return `<div class="d-flex border-bottom main-cart-item">
      <div>
         <a class="d-flex p-3" href="product-details.html">
            <div class="drop-img cover-image" data-image-src='${p.product.images[0]}' style="background: url('${p.product.images[0]}') center center"></div>
            <div class="ms-3 text-start">
               <h5 class="mb-1 text-muted tx-13">${p.product.name}</h5>
               <div class="text-dark tx-semibold tx-12">${p.product.quantity} * ${p.product.price}</div>
            </div>
         </a>
      </div>
      
   </div>`;
    });

    divRender.innerHTML = products.join('');
  });
};

const createUser = () => {
  try {
    $('#btn-create-user').on('click', async () => {
      const firstName = $('#first-name').val();
      const lastName = $('#last-name').val();
      const password = $('#password').val();
      const email = $('#email').val();
      const phone = $('#phone').val();
      const username = $('#username').val();

      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, phone, password, username }),
      });

      const data = await response.json();

      if (data.code == 201) {
        updateData();
        $('#close-1').click();
        notif({
          msg: 'Tạo thành công',
          position: 'right',
          bottom: '10',
        });

        return;
      }

      if (data.code == 400) {
        notif({
          msg: data.message,
          type: 'error',
          position: 'right',
          zindex: 99999999,
        });
        return;
      }
    });
  } catch (error) {
    console.log('error');
    notif({
      msg: error,
      type: 'error',
      position: 'right',
      zindex: 99999999,
    });
  }
};

const orderCancel = () => {
  let order;
  $('#file-datatable tbody').on('click', 'button#btnDelete', function () {
    order = $('#file-datatable').DataTable().row($(this).parents('tr')).data();
  });

  $('#lock').on('click', async function () {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Huỷ bỏ' }),
    };

    const response = await fetch(`/api/v1/orders/${order.id}`, requestOptions);
    const data = await response.json();

    if (data.code == 200) {
      $('#modaldemo2').modal('hide');
      notif({
        msg: 'Thành công',
        position: 'right',
        bottom: '10',
      });
      updateData();
      return;
    }

    if (data.message) {
      notif({
        type: 'error',
        msg: data.message,
        position: 'right',
        bottom: '10',
      });
    }
  });
};

const updateStatusOrder = () => {
  let category;
  $('#file-datatable tbody').on('click', 'button#btnEdit', function () {
    order = $('#file-datatable').DataTable().row($(this).parents('tr')).data();

    // $('#first-name-update').val(user.firstName);
    // $('#last-name-update').val(user.lastName);
    // $('#email-update').val(user.email);
    // $('#phone-update').val(user.phone);
    // $('#username-update').val(user.username);
  });

  // TODO: Handle submit update user
  $('#btn-update-user').on('click', async function () {
    try {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Xác nhận' }),
      };

      const response = await fetch(`/api/v1/orders/${order.id}`, requestOptions);
      const data = await response.json();

      if (data.code == 200) {
        $('#update-modal').modal('hide');
        notif({
          msg: 'Sửa thành công',
          position: 'right',
          bottom: '10',
        });
        updateData();
      }

      if (data.code == 400) {
        notif({
          msg: data.message,
          type: 'error',
          position: 'right',
          zindex: 99999999,
        });
      }
    } catch (error) {
      notif({
        msg: error,
        type: 'error',
        position: 'right',
        zindex: 99999999,
      });
    }
  });
};

$(document).ready(function () {
  loadOrders();
  viewDetailOrder();
  updateStatusOrder();
  orderCancel();
});
