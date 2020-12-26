$('#detailModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget) // Button that triggered the modal
    const username = button.data('username')
    const emmail = button.data('email')
    const firstName = button.data('firstname')
    const lastName = button.data('lastname')
    const more = button.data('more')
    const phoneNumber = button.data('phonenumber')
    const isActive = button.data('isactive')
    const id = button.data('id')
    // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    const modal = $(this)
    modal.find('.modal-body #id').val(id)
    modal.find('.modal-body #username').val(username)
    modal.find('.modal-body #email').val(emmail)
    modal.find('.modal-body #firstName').val(firstName)
    modal.find('.modal-body #lastName').val(lastName)
    modal.find('.modal-body #more').val(more)
    modal.find('.modal-body #phoneNumber').val(phoneNumber)
    if (isActive == true){
      modal.find('.modal-body .isActive').filter('[value=true]').prop('checked', true)
    } else {  
      modal.find('.modal-body .isActive').filter('[value=false]').prop('checked', true)
    }
  })
  $('#activeModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget) // Button that triggered the modal
    const username = button.data('username')
    const emmail = button.data('email')
    const isActive = button.data('isactive')
    const id = button.data('id')
    // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    const modal = $(this)
    modal.find('.modal-body #id').val(id)
    modal.find('.modal-body #username').val(username)
    modal.find('.modal-body #email').val(emmail)
    if (isActive == true){
      modal.find('.modal-body .isActive').filter('[value=true]').prop('checked', true)
    } else {  
      modal.find('.modal-body .isActive').filter('[value=false]').prop('checked', true)
    }
  })