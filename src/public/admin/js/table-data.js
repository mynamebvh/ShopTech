$(function(e) {
	
	//______Basic Data Table
	// $('#basic-datatable').DataTable({
	// 	language: {
	// 		searchPlaceholder: 'Search...',
	// 		sSearch: '',
	// 	}
	// });

	//______Input fields Data Table
	// $('#input-fields').DataTable({
	// 	language: {
	// 		searchPlaceholder: 'Search...',
	// 		sSearch: '',
	// 	}
	// });
	

	//______Basic Data Table
	// $('#responsive-datatable').DataTable({
	// 	responsive: true,
	// 	language: {
	// 		searchPlaceholder: 'Search...',
	// 		sSearch: '',
	// 	}
	// });

	//______File-Export Data Table
	var table = $('#file-datatable').DataTable({
		buttons: [ 'copy', 'excel', 'pdf', 'colvis' ],
		responsive: true,
		language: {
			sProcessing: "Đang xử lý...",
      sLengthMenu: "Chọn số bản ghi hiển thị trên một trang _MENU_ bản ghi",
      sZeroRecords: "Không có dữ liệu để hiển thị.",
      sInfo: "Hiển thị từ _START_ đến _END_ trong tổng số _TOTAL_",
      sInfoEmpty: "Hiển thị từ 0 đến 0 trong tổng số 0 mục",
      sInfoFiltered: "(được lọc từ _MAX_ bản ghi)",
      sInfoPostFix: "",
      sSearch: "Tìm kiếm:",
      sUrl: "",
      oPaginate: {
        sFirst: "Đầu",
        sPrevious: "Trước",
        sNext: "Tiếp",
        sLast: "Cuối",
      },
		}
	});
	table.buttons().container()
	.appendTo( '#file-datatable_wrapper .col-md-6:eq(0)' );	

	//______Delete Data Table
	// var table = $('#delete-datatable').DataTable({
	// 	language: {
	// 		searchPlaceholder: 'Search...',
	// 		sSearch: '',
	// 	}
	// }); 
    $('#delete-datatable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
    $('#button').click( function () {
        table.row('.selected').remove().draw( false );
    } );
	

	//______Select2 
	$('.select2').select2({
		minimumResultsForSearch: Infinity,
		width:"auto",
	});


});