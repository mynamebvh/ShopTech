function updateData() {
  $('#file-datatable').DataTable().ajax.reload();
}

const loadUsers = () => {
  const api = '/api/v1/users?sortBy=createdAt:desc';
  var table = $('#file-datatable').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: api,
      dataSrc: function (json) {
        console.log(json.data);

        const result = json.data.map((data) => {
          let method = null;
          if (data.isLocked) {
            method = ` 
            <button type="button" class="btn btn-primary" id="btnEdit" data-bs-toggle="modal" data-bs-target="#update-modal"><i class="fa fa-edit"></i> Sửa</button>
                                            
            <button type="button" class="btn btn-secondary" id="btnDelete" data-bs-toggle="modal" data-bs-target="#modaldemo2"><i class="fas fa-eye-slash"></i></i> Mở khoá TK</button>`;
          } else {
            method = ` 
              <button type="button" class="btn btn-primary" id="btnEdit" data-bs-toggle="modal" data-bs-target="#update-modal"><i class="fa fa-edit"></i> Sửa</button>
                                              
              <button type="button" class="btn btn-secondary" id="btnDelete" data-bs-toggle="modal" data-bs-target="#modaldemo2"><i class="fas fa-eye-slash"></i></i> Khoá TK</button>`;
          }

          return { ...data, method };
        });

        return result;
      },
    },

    columns: [
      { data: null, defaultContent: '', className: 'sttColumn' },
      {
        data: 'firstName',
      },
      { data: 'lastName' },
      { data: 'email' },

      { data: 'phone' },
      { data: 'amount' },
      {
        data: 'isLocked',
        render: function (data, type, row) {
          if (!data) {
            return "<span class='text-info tx-bold'>Hoạt động</span>";
          } else {
            return "<span class='text-secondary tx-bold'>Khoá</span>";
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

      console.log(response);
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

const lockUser = () => {
  let user;
  $('#file-datatable tbody').on('click', 'button#btnDelete', function () {
    user = $('#file-datatable').DataTable().row($(this).parents('tr')).data();
  });

  $('#lock').on('click', async function () {
    const response = await fetch(`/api/v1/users/${user.id}`, {
      method: 'LOCK',
    });

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

const updateUser = () => {
  let category;
  $('#file-datatable tbody').on('click', 'button#btnEdit', function () {
    user = $('#file-datatable').DataTable().row($(this).parents('tr')).data();

    
    $('#first-name-update').val(user.firstName);
    $('#last-name-update').val(user.lastName);
    $('#email-update').val(user.email);
    $('#phone-update').val(user.phone);
    $('#username-update').val(user.username);
  });

  // TODO: Handle submit update user
  $('#btn-update-user').on('click', async function () {
    const dataUpdate = {
      firstName: $('#first-name-update').val(),
      lastName: $('#last-name-update').val(),
      email: $('#email-update').val(),
      phone: $("#phone-update").val(),
      username: $("#username-update").val(),
    };

    try {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataUpdate),
      };

      const response = await fetch(`/api/v1/users/${user.id}`, requestOptions);
      const data = await response.json();

      console.log('RESPONSE', data);

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
  loadUsers();
  createUser();
  lockUser();
  updateUser();
});
