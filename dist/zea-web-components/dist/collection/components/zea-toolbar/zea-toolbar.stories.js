import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-toolbar', module)
  .add('Default', () => {
    const toolbar = document.createElement('zea-toolbar')
    toolbar.tools = {
      tool1: {
        tag: 'zea-toolbar-tool',
        data: {
          iconName: 'alarm-outline',
          toolName: 'Alarm Test Tool',
          callback: function (e) {
            console.log('alarm clicked', e)
          },
        },
      },
      tool2: {
        tag: 'zea-toolbar-toolset',
        data: {
          tools: {
            tool21: {
              tag: 'zea-toolbar-tool',
              data: {
                iconName: 'beer-outline',
                toolName: 'beer Test Tool',
              },
            },
            tool22: {
              tag: 'zea-toolbar-tool',
              data: {
                iconName: 'bicycle-outline',
                toolName: 'bicycle Test Tool',
              },
            },
            tool23: {
              tag: 'zea-toolbar-tool',
              data: {
                iconName: 'car-outline',
                toolName: 'car Test Tool',
              },
            },
          },
        },
      },
      tool22: {
        tag: 'zea-toolbar-toolset',
        data: {
          tools: {
            tool21: {
              tag: 'zea-toolbar-tool',
              data: {
                iconName: 'beer-outline',
                toolName: 'beer Test Tool',
              },
            },
            tool22: {
              tag: 'zea-toolbar-tool',
              data: {
                iconName: 'bicycle-outline',
                toolName: 'bicycle Test Tool',
              },
            },
            tool23: {
              tag: 'zea-toolbar-tool',
              data: {
                iconName: 'car-outline',
                toolName: 'car Test Tool',
              },
            },
          },
        },
      },
      tool3: {
        tag: 'zea-toolbar-tool',
        data: {
          iconName: 'bar-chart-outline',
          toolName: 'Bar Chart Test Tool',
          callback: function () {
            console.log('tool 3 clicked')
          },
        },
      },
      tool4: {
        tag: 'zea-toolbar-colorpicker',
        data: {
          colors: {
            color1: {
              background: 'red',
              foreground: 'white',
              callback: function (e) {
                console.log('clicked red', e)
              },
            },
            color2: {
              background: 'green',
              foreground: 'white',
            },
            color3: {
              background: 'blue',
              foreground: 'white',
            },
          },
        },
      },
    }

    return toolbar
  })
  .add('PDF Editor', () => {
    const toolbar = document.createElement('zea-toolbar')
    toolbar.tools = {
      cursor: {
        tag: 'zea-toolbar-tool',
        data: {
          iconName: 'navigate-outline',
          toolName: 'Navigate',
          callback: () => {
            console.log('Callback call')
          },
        },
      },
      arrow: {
        tag: 'zea-toolbar-tool',
        data: {
          iconName: 'arrow-forward-outline',
          toolName: 'Arrow Tool',
          callback: () => {
            console.log('Callback call')
          },
        },
      } /*
    circle: {
      tag: 'zea-toolbar-tool',
      data: {
        iconName: 'ellipse-outline',
        toolName: 'Circle Tool',
        callback: () => {
          setTool(circleTool);
          return;
        },
      },
    },*/,
      freeHand: {
        tag: 'zea-toolbar-tool',
        data: {
          iconName: 'pencil-outline',
          toolName: 'Free Hand Tool',
          callback: () => {
            console.log('Callback call')
          },
        },
      },
      polygon: {
        tag: 'zea-toolbar-tool',
        data: {
          iconName: 'analytics-outline',
          toolName: 'Polygon Tool',
          callback: () => {
            console.log('Callback call')
          },
        },
      },
      rectangle: {
        tag: 'zea-toolbar-tool',
        data: {
          iconName: 'square-outline',
          toolName: 'Rectangle Tool',
          callback: () => {
            console.log('Callback call')
          },
        },
      },
      color: {
        tag: 'zea-toolbar-colorpicker',
        data: {
          colors: {
            blue: {
              background: '#00a7ff',
              foreground: 'white',
              callback: () => {
                console.log('Callback blue')
              },
            },
            red: {
              background: '#ff4848',
              foreground: 'white',
              callback: () => {
                console.log('Callback red')
              },
            },
            green: {
              background: '#03c149',
              foreground: 'white',
              callback: () => {
                console.log('Callback green')
              },
            },
            yellow: {
              background: '#f8c706',
              foreground: 'black',
              callback: () => {
                console.log('Callback yellow')
              },
            },
            orange: {
              background: '#fb8002',
              foreground: 'white',
              callback: () => {
                console.log('Callback orange')
              },
            },
            violet: {
              background: 'violet',
              foreground: 'white',
              callback: () => {
                console.log('Callback orange')
              },
            },
            black: {
              background: 'black',
              foreground: 'white',
              callback: () => {
                console.log('Callback black')
              },
            },
          },
        },
      },
    }

    return toolbar
  })
