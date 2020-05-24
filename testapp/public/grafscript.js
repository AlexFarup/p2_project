                    console.log("<%= gp_add %>");
                    console.log("<%= gp_sub %>");
                    console.log("<%= gp_div %>");
                    console.log("<%= gp_mul %>");
                      
                      let myChart = document.getElementById('myChart').getContext('2d');
                
                        Chart.defaults.global.defaultFontFamily = 'Lato';
                        Chart.defaults.global.defaultFontSize = 18;
                        Chart.defaults.global.defaultFontColor = '#777';
                
                      let studentChart = new Chart(myChart, {
                          type:'bar',
                          data: {
                            labels:['Addition','Subtraktion','Division','Mulitiplikation'],
                            datasets:[{
                                label:'Rigtige Svar',
                                data:[
                                   
                                   "<%= gp_add %>",
                                   "<%= gp_sub %>",
                                   "<%= gp_div %>",
                                   "<%= gp_mul %>",
                                   0,
                                   100
                                ],
                                backgroundColor:'rgba(0, 999, 0, 0.3)',
                                borderWidth:1,
                                borderColor:'#777',
                                hoverBorderWidth:3,
                                hoverBorderColor:'#000'
                            }]
                
                          },
                          options: {
                            title:{
                              display:true,
                              text:'Oversigt over <%= elev_navn %> <%= elev_efternavn %>s matematiske færdigheder',
                              fontSize:25
                            },
                            legend:{
                              position:'right',
                              labels:{
                                  fontColor:'#000'
                              }
                            },
                            layout:{
                                padding:{
                                    left:50,
                                    right:0,
                                    bottom:0,
                                    top:0
                                }
                            },
                            tooltips:{
                              enabled:true
                            }
                          }
                      });
             