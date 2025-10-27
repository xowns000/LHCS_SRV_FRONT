CKEDITOR.plugins.add( 'simpleImageUpload', {
    init: function( editor ) {

        var fileDialog = $('<input type="file">');
        fileDialog.on('change', function (e) {
            var uploadUrl = editor.config.filebrowserImageUploadUrl;
			var file = fileDialog[0].files[0];
			var imageData = new FormData();
			imageData.append('upload', file);

			$.ajax({
				url: uploadUrl,
				type: 'POST',
                headers: {
                    'CERT-CUSTCO-TENANT-ID':  JSON.parse(sessionStorage.getItem("vuex")).authStore.custco_tenant_id,
                    'CERT-CUSTCO-ID':  JSON.parse(sessionStorage.getItem("vuex")).userStore.user_role.company.CD,
                    'Authorization':'bearer ' + window.sessionStorage.getItem("token")
                },
                contentType: false,
				processData: false,
				data: imageData,
			}).done(function(done) {

                done = JSON.parse(done);
                // console.log( done );
				var ele = editor.document.createElement('img');
                ele.setAttribute('src', window.location.protocol + "//" + window.location.hostname +":" + window.location.port +  done.url );
				editor.insertElement(ele);
			});

        })
        editor.ui.addButton( 'Image', {
            label: 'Insert Image',
            command: 'openDialog',
            toolbar: 'insert'
        });
        editor.addCommand('openDialog', {
            exec: function(editor) {
                fileDialog.click();
            }
        });
    }
});