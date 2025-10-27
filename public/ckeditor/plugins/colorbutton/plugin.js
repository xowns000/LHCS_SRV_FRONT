CKEDITOR.plugins.add('colorbutton', {
	path: '/ckeditor/plugins/colorbutton/', // 경로 수정
	icons: 'colorbutton',
	init: function(editor) {
		// 'TextColor' 버튼 생성
		editor.ui.addButton('TextColor', {
			label: 'Text Color',
			command: 'textcolor',
			toolbar: 'colors,0'
		});

		// 'BGColor' 버튼 생성
		editor.ui.addButton('BGColor', {
			label: 'Background Color',
			command: 'bgcolor',
			toolbar: 'colors,1'
		});

		// 'textcolor' 명령 생성
		editor.addCommand('textcolor', {
			exec: function(editor) {
				var color = prompt('Enter a color code or name:', '');
				if (color) {
					editor.applyStyle(new CKEDITOR.style({
						element: 'span',
						styles: { color: color }
					}));
				}
			}
		});

		// 'bgcolor' 명령 생성
		editor.addCommand('bgcolor', {
			exec: function(editor) {
				var color = prompt('Enter a color code or name:', '');
				if (color) {
					editor.applyStyle(new CKEDITOR.style({
						element: 'span',
						styles: { 'background-color': color }
					}));
				}
			}
		});
	}
});
