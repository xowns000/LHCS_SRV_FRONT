// tuiGridConfig.js
const tuiGridConfig  = {
  usageStatistics: false,
  //default setting
  scrollX: false,
  minRowHeight: 40,
  // bodyHeight: 'fitToParent',
  bodyHeight: 600, // 한줄 높이 40 * 15줄
  header: {
    height: 40,
  },
  rowHeight: 40,
  // 헤더
  rowHeaders: [
    {
      type: 'rowNum',
      // renderer: {
      //   type: RowNumberRenderer
      // }
    },
  ],
  // 테마
  theme: {
    name: 'customTheme',
    value: {
      outline:{
        border: 'transparent',
        showVerticalBorder: false,
      },
      selection: {
        background: '#4daaf9',
        border: '#004082'
      },
      scrollbar: {
        background: '#f5f5f5',
        thumb: '#d9d9d9',
        active: '#c1c1c1',
      },
      row: {
        even: {
          // background: '#f3ffe3'
        },
        hover: {
          background: '#eee'
        }
      },
      cell: {
        normal: {
          background: '#fff',
          // border: '#dbdbdb',
          showVerticalBorder: false
        },
        header: {
          // background: '#f1f4fb',
          // border: '#dbdbdb',
          border: 'transparent',
          showVerticalBorder: false
        },
        rowHeader: {
          border: 'transparent',
          showVerticalBorder: false
        },
        editable: {
          background: '#fff'
        },
        selectedHeader: {
          background: '#d8d8d8'
        },
        focused: {
          border: '#418ed4'
        },
        disabled: {
          text: '#b0b0b0',
        }
      }
    }
  },
  theme_rowspan: {
    name: 'customTheme',
    value: {
      selection: {
        background: '#4daaf9',
        border: '#004082'
      },
      scrollbar: {
        background: '#f5f5f5',
        thumb: '#d9d9d9',
        active: '#c1c1c1',
      },
      row: {
        even: {
          // background: '#f3ffe3'
        },
        hover: {
          background: '#eee'
        }
      },
      cell: {
        normal: {
          background: '#fff',
          // border: '#dbdbdb',
          showVerticalBorder: true
        },
        header: {
          // background: '#f1f4fb',
          border: '#dbdbdb',
          showVerticalBorder: true
        },
        rowHeader: {
          border: '#eee',
          showVerticalBorder: true
        },
        editable: {
          background: '#fff'
        },
        selectedHeader: {
          background: '#d8d8d8'
        },
        focused: {
          border: '#418ed4'
        },
        disabled: {
          text: '#b0b0b0',
        }
      }
    }
  },
  // 컬럼
  columnOptions: {
    resizable: true, //리사이즈 가능
  },
  // draggable: true,
}

export default tuiGridConfig;
