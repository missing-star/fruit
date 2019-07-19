new Vue({
    el: '#app',
    data: {
        currentTime: '0000-00-00 00:00:00',
        currentIndex: 0,
        subCurrentIndex: 0,
        onlineCurrentIndex: 0,
        offlineCurrentIndex: 0,
        currentOrderId: -1,
        currentOrderOffline: -1,
        currentOrderDialog: -1,
        isShowDialog: false,
        isShowLoading: false,
        dialogTitle: '',
        dialogIndex: 0, //0==>挂单，1==>结算，2==>扫码，3==>非水果，4==>设置
        isOpen: false,
        shopCode: 'HP8097021061',
        shopPwd: '123',
        // 是否开启调试模式
        isDebug: true,
        // 分类列表
        categoryList: [],
        // 商品列表
        goodsList: [],
        // 商品列表页码
        goodsListPage: 1,
        //线上订单
        orderListOnline: [],
        // 线上订单页码
        orderListOnlinePage: 1,
        //线下订单
        orderListOffline: [],
        // 线下订单页码
        orderListOfflinePage: 1,
        // 线上订单详情
        orderDetailOnline: {
            orderCode: -1
        },
        // 线下订单详情
        orderDetailOffline: {
            orderCode: -1
        },
        // 结算区商品列表
        calculateGoodsList: [],
        // 挂单列表
        storeList: [],
        // 挂单列表详情
        storeListDetail: {

        },
        // 上一次稳定水果的重量,
        preFruitWeight: 0,
        // 是否更换了水果
        isChangeFruit: false,
        // 当前选择的水果
        currentSelectedFruit: {
            id: '',
            productCode: '',
            pic: '',
            name: '',
            price: ''
        },
        // 店铺信息
        shopInfo: {},
        // 秤是否稳定
        isSteady: false,
        // 是否还有更多商品
        isMoreGoods: true,
        // 是否还有更多线上订单
        isMoreOnlineOrder: true,
        // 是否还有更多线下订单
        isMoreOfflineOrder: true,
        // 每页记录数
        pageSize: 10,
        // 付款二维码
        payCode: {
            wxPicUrl: '',
            aliPicUrl: ''
        },
        // 付款二维码展示的金额，订单信息
        showPayInfo: {
            orderNum: '',
            orderAmount: '0.00'
        },
        // 是否已经播报完毕
        isPlayOver: true,
        // 提示信息内容
        tips:'暂无操作',
        // 警告或成功
        isSuccess:true,
        //是否显示提示信息
        isShowTips:false
    },
    methods: {
        /**
         * 获取当前时间
         */
        getCurrentTime: function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
            var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            this.currentTime = year + '-' + month + '-' + day + ' ' + hour + ' : ' + minute + ' : ' + second;
        },
        /**
         * 切换顶部tab
         * @param {number} index 
         */
        switchTab: function (index) {
            if (this.currentIndex != index) {
                this.currentIndex = index;
                switch (index) {
                    case 0:
                        this.getCategoryList();
                        break;
                    case 1:
                        this.isMoreOnlineOrder = true;
                        this.orderListOnlinePage = 1;
                        this.getOrderList(1);
                        break;
                    case 2:
                        this.isMoreOfflineOrder = true;
                        this.orderListOfflinePage = 1;
                        this.getOrderList(0);
                        break;
                    case 3:
                        break;
                }
            }
        },
        /**
         *切换开关 
         */
        toggleOpen: function () {
            this.isOpen = !this.isOpen;
        },
        /**
         * 切换结算区右侧分类tab
         * @param {number} index 
         */
        switchSubTab: function (index) {
            if (this.subCurrentIndex != index) {
                this.isMoreGoods = true;
                this.goodsListPage = 1;
                this.subCurrentIndex = index;
                this.getGoodsByCategory(index);
            }
        },
        /**
         * 切换在线订单打印/未打印tab
         * @param {number} index 
         */
        switchOnlineTab: function (index) {
            if (this.onlineCurrentIndex != index) {
                this.onlineCurrentIndex = index;
            }
        },
        /**
         * 线下订单支付/未支付tab
         * @param {number} index 
         */
        switchOfflineTab: function (index) {
            if (this.offlineCurrentIndex != index) {
                this.offlineCurrentIndex = index;
            }
        },
        /**
         * 切换接单/未接单子列表
         * @param {number} onlineCurrentIndex 
         * @param {number} currentOrderId 
         */
        getOrderDetail: function (onlineCurrentIndex, currentOrderId) {
            if (this.onlineCurrentIndex != onlineCurrentIndex || currentOrderId != this.currentOrderId) {
                this.onlineCurrentIndex = onlineCurrentIndex;
                this.currentOrderId = currentOrderId;
                this.orderDetailOnline = this.orderListOnline.filter(function (item) {
                    return item.id == currentOrderId;
                });
            }
        },
        /**
         * 切换支付/未支付子列表
         * @param {number} onlineCurrentIndex 
         * @param {number} currentOrderId 
         */
        getOrderDetailOffline: function (offlineCurrentIndex, currentOrderId) {
            if (this.offlineCurrentIndex != offlineCurrentIndex || currentOrderId != this.currentOrderOffline) {
                this.offlineCurrentIndex = offlineCurrentIndex;
                this.currentOrderOffline = currentOrderId;
                this.orderDetailOffline = this.orderListOffline.find(function (item) {
                    return item.id == currentOrderId;
                });
            }
        },
        /**
         * 切换挂单列表里的订单
         * @param {number} currentOrderDialog 
         */
        getOrderDetailDialog: function (currentOrderDialog) {
            if (this.currentOrderDialog != currentOrderDialog) {
                this.currentOrderDialog = currentOrderDialog;
                this.storeListDetail = this.storeList.find(function (item) {
                    return item.orderNum == currentOrderDialog;
                });
            }
        },
        /**
         * 选择了商品
         */
        startCalculate: function (id, productCode, pic, name, price) {
            if (id != this.currentSelectedFruit.id) {
                this.currentSelectedFruit.id = id;
                this.currentSelectedFruit.productCode = productCode;
                this.currentSelectedFruit.pic = pic;
                this.currentSelectedFruit.name = name;
                this.currentSelectedFruit.price = price;
                if (this.isSteady) {
                    this.calculatePrice();
                }
            }
        },
        /**
         * 检查是否开启了水果识别
         */
        scanFruit: function () {
            var vm = this;
            if (vm.isOpen) {
                // 置空选择的商品
                vm.currentSelectedFruit = {
                    id: '',
                    productCode: '',
                    pic: '',
                    name: '',
                    price: ''
                };
                // 开启了水果识别
                vm.takePhoto(function (res) {
                    // 识别成功后打开对应的tab，识别失败则手动选择
                    if (res.result == 'fail') {
                        vm.toast(false,'识别失败，请手动选择');
                    } else {
                        vm.switchSubTab(res.code);
                    }
                });
            } else {
                if (vm.currentSelectedFruit.id != '') {
                    // 计算
                    vm.calculatePrice();
                }
            }
        },
        /**
         * 计算该份商品价格
         */
        calculatePrice: function () {
            var vm = this;
            vm.calculateGoodsList.push({
                id: new Date().getTime(),
                productCode: vm.currentSelectedFruit.productCode,
                pic: vm.currentSelectedFruit.pic,
                name: vm.currentSelectedFruit.name,
                price: vm.currentSelectedFruit.price,
                weight: vm.preFruitWeight,
                totalPrice: parseFloat(vm.currentSelectedFruit.price * vm.preFruitWeight).toFixed(2)
            });
            vm.isSteady = false;
        },
        /**
         * 删除结算区商品
         * @param {number} id
         */
        deleteGoods: function (id) {
            this.calculateGoodsList = this.calculateGoodsList.filter(function (value) {
                return value.id != id;
            });
        },
        /**
         * 滚动加载事件监听
         * @param {dom} ref 
         * @param {dom} refSub 
         * @param {function} callback 
         */
        watchScroll: function (ref, refSub, callback) {
            var vm = this;
            ref.addEventListener('scroll', function () {
                var moreTop = refSub.getBoundingClientRect().top;
                if (moreTop < document.documentElement.clientHeight) {
                    // 滚动区域已经将loadmore区域显示出来
                    callback();
                }
            });
        },
        /**
         * 删除挂单列表里的订单
         * @param {number} orderNum 
         */
        deleteStorList: function () {
            var vm = this;
            if (confirm('确定删除此订单吗？')) {
                vm.storeList = vm.storeList.filter(function (item) {
                    return item.orderNum != vm.currentOrderDialog;
                });
                vm.storeListDetail = {};
                vm.currentOrderDialog = -1;
                localStorage.setItem('storeList', JSON.stringify(vm.storeList));
            }
        },
        /**
         * 打印小票
         * @param {number} type
         */
        printTick: function () {
            // var fs = require('fs'); // 引入fs模块

            // // 写入文件内容（如果文件不存在会创建一个文件）
            // // 传递了追加参数 { 'flag': 'a' }
            // fs.writeFile('./ticket.html', `
            // <h3 align="center">永辉</h3>
            // <div style="float:left;">收银员: 收银员1</div>
            // <div style="float:right;">日期: 2018-08-08</div>
            // <hr style="border-top: 1px dotted #8c8b8b;" />
            // <table border="0" width="100%">
            //     <tr>
            //         <td>品名</td>
            //         <td align="right">数量</td>
            //         <td align="right">金额</td>
            //     </tr>
            //     <tr>
            //         <td>绿箭口香糖</td>
            //         <td align="right">1</td>
            //         <td align="right">1.50</td>
            //     </tr>
            //     <tr>
            //         <td>奥利奥</td>
            //         <td align="right">2</td>
            //         <td align="right">16.00</td>
            //     </tr>
            //     <tr>
            //         <td>黑人牙膏</td>
            //         <td align="right">1</td>
            //         <td align="right">10.50</td>
            //     </tr>
            // </table>
            // <hr style="border-top: 1px dotted #8c8b8b;" />
            // <div align="right"><font size="2" style="font-weight: bold;">小计: 28.00</font></div>
            // <p align="center"><font size="3" style="font-weight: bold;">谢谢您的光临</font></p>
            // `, {
            //     'flag': 'a'
            // }, function (err) {
            //     if (err) {
            //         throw err;
            //     }

            // });
            $(this.$refs.printArea).jqprint({
                iframe: true
            });
        },
        /**
         * 更新订单状态
         */
        updateOrderStatus:function(orderCode) {
            axios.post('rpcShop/updateShopOrder',this.stringifyParams({
                orderCode:orderCode,
                orderStatus:0,
                isPrint:1
            })).then(function(res) {

            }).catch(function(err) {
                vm.log(err);
            });
        },
        /**
         * 设置switch开关值
         */
        setSwitch: function () {
            if (localStorage.getItem('isOpen')) {
                this.isOpen = localStorage.getItem('isOpen') == 'false' ? false : true;
            } else {
                localStorage.setItem('isOpen', false);
            }
        },
        /**
         * 保存是否自动识别开关
         */
        saveSwitch: function () {
            localStorage.setItem('isOpen', this.isOpen);
            this.closeDialog();
        },
        /**
         * 根据type显示不同的dialog
         * @param {number} type 
         */
        showDialog: async function (type, flag) {
            var vm = this;
            vm.setSwitch();
            vm.dialogIndex = type;
            switch (type) {
                case 0:
                    // 挂单
                    vm.dialogTitle = '挂单';
                    vm.getStoreList();
                    break;
                case 1:
                    // 结算
                    vm.dialogTitle = '结算';
                    if (flag) {
                        if (vm.calculateGoodsList.length == 0) {
                            vm.toast(false,'暂无结算列表');
                            return;
                        }
                        var list = [];
                        vm.calculateGoodsList.forEach(function (item) {
                            list.push(item);
                        });
                        vm.storeListDetail = {
                            orderNum: new Date().getTime(),
                            totalMoney: vm.totalMoney,
                            list: list
                        }
                    }
                    break;
                case 2:
                    vm.dialogTitle = '结算';
                    break;
                case 3:
                    // 非水果
                    vm.dialogTitle = '非水果类商品';
                    break;
                case 4:
                    // 设置
                    vm.dialogTitle = '设置';
                    break;
            }
            vm.isShowDialog = true;
        },
        /**
         *提交订单
         */
        submitOrder: async function () {
            var vm = this;
            await axios.post('rpcShop/getOrderCode').then(function (res) {
                return res;
            }).then(function (res) {
                var orderNo = res.data.responseObject.data;
                if (res.data.successFlag == 0) {
                    axios.post('rpcShop/makeUnderShopOrder', vm.stringifyParams({
                        shopCode: vm.shopInfo.shopCode,
                        shopName: vm.shopInfo.shopName,
                        shopHeadUrl: vm.shopInfo.headUrl,
                        orderCode: orderNo,
                        orderDetailList: vm.storeListDetail.list.map(function (item) {
                            return {
                                productCode: item.productCode,
                                productName: item.name,
                                url: item.pic,
                                price: item.price,
                                productCount: 1
                            }
                        })
                    })).then(function (res) {
                        if (res.data.successFlag == 0) {
                            // 提交订单成功，从本地挂单列表中删除
                            vm.storeList = vm.storeList.filter(function (item) {
                                return item.orderNum != vm.currentOrderDialog;
                            });
                            vm.storeListDetail = {};
                            vm.currentOrderDialog = -1;
                            localStorage.setItem('storeList', JSON.stringify(vm.storeList));
                            vm.getPayQrCode(orderNo);
                        } else {
                            vm.toast(false,'提交订单失败');
                        }
                    }).catch(function (err) {
                        vm.log(err);
                    });
                } else {
                    vm.toast(false,'生成订单失败');
                }
            }).catch(function (err) {
                vm.log(err);
            });
        },
        /**
         * 获得订单支付二维码地址
         */
        getPayQrCode: function (orderNum, orderAmount) {
            var vm = this;
            vm.showDialog(2);
            vm.isShowLoading = true;
            // 获取二维码地址
            axios.post('charge/getPayPic', vm.stringifyParams({
                actionNo: orderNum
            })).then(function (res) {
                if (res.data.successFlag == 0) {
                    // 展示付款码
                    vm.payCode = res.data.responseObject.data;
                    vm.showPayInfo.orderNum = orderNum;
                    vm.showPayInfo.orderAmount = orderAmount == null ? '0.00' : orderAmount;
                    vm.isShowLoading = false;
                }
            }).catch(function (err) {
                vm.log(err);
            });
        },
        /**
         * 关闭dialog
         */
        closeDialog: function () {
            this.isShowDialog = false;
            // 置空订单详情，挂单tab
            this.storeListDetail = {};
            this.currentOrderDialog = -1;
        },
        /**
         * 打印错误信息
         * @param {string} msg 
         */
        log: function (msg) {
            if (this.isDebug) {
                console.log(msg);
            }
        },
        /**
         * 获得用户媒体信息
         * @param {object} constraints 
         * @param {function} success 
         * @param {function} error 
         */
        getUserMedia: function (constraints, success, error) {
            if (navigator.mediaDevices.getUserMedia) {
                //最新的标准API
                navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
            } else if (navigator.webkitGetUserMedia) {
                //webkit核心浏览器
                navigator.webkitGetUserMedia(constraints, success, error)
            } else if (navigator.mozGetUserMedia) {
                //firfox浏览器
                navigator.mozGetUserMedia(constraints, success, error);
            } else if (navigator.getUserMedia) {
                //旧版API
                navigator.getUserMedia(constraints, success, error);
            }
        },
        /**
         * 获得媒体成功回调
         * @param {*} stream 
         */
        success: function (stream) {
            //兼容webkit核心浏览器
            // let CompatibleURL = window.URL || window.webkitURL;
            //将视频流设置为video元素的源
            //video.src = CompatibleURL.createObjectURL(stream);
            this.$refs.videoPlayer.srcObject = stream;
            this.$refs.videoPlayer.play();
            this.takePhoto();
        },
        /**
         * 获得媒体失败回调
         * @param {*} error 
         */
        error: function (error) {
            this.log('访问用户媒体设备失败' + error.name + '：' + error.message);
        },
        /**
         * 拍照
         */
        takePhoto: function (callback) {
            var vm = this;
            var canvas = document.createElement('canvas');
            canvas.width = 480;
            canvas.height = 320;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this.$refs.videoPlayer, 0, 0);
            var base64Data = canvas.toDataURL();
            var formData = new FormData();
            formData.append('image', vm.dataURLtoFile(base64Data));
            formData.append('shopCode', vm.shopCode);
            axios.post('admin/uploadManager/photoView', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(function (res) {
                callback(res.data);
            }).then(function (err) {
                vm.log(err);
            })
        },
        /**
         * base64字符串转File对象
         * @param {string} dataurl
         */
        dataURLtoFile: function (dataurl) { //将base64转换为文件
            var filename = new Date().getTime();
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            var res = new File([u8arr], filename, {
                type: mime
            });
            return res;
        },
        /**
         * 获取重量
         */
        getWeight: function () {
            var vm = this;
            setInterval(function () {
                axios.get("http://127.0.0.1:5017/api/Scale/Weight").then(function (data) {
                    if (data.data.Weight <= 0 && vm.preFruitWeight > 0) {
                        vm.isChangeFruit = true;
                    }
                    if (data.data.IsSteady == 1 && data.data.Weight > 0 &&
                        (data.data.Weight.toFixed(2) != vm.preFruitWeight || vm.isChangeFruit)) {
                        // 已经稳定
                        vm.isSteady = true;
                        vm.preFruitWeight = data.data.Weight.toFixed(2);
                        vm.isChangeFruit = false;
                        vm.scanFruit();
                    }
                }).catch(function (err) {
                    vm.log(err);
                });
            }, 100);
        },
        /**
         * 参数转换
         * @param {object} param
         */
        stringifyParams: function (param) {
            return Qs.stringify({
                param: JSON.stringify(param)
            });
        },
        /**
         * 商家登录
         */
        login: function () {
            var vm = this;
            axios.post('rpcShop/querOneShop', vm.stringifyParams({
                shopCode: vm.shopCode,
                shopPwd: vm.shopPwd
            })).then(function (res) {
                vm.shopInfo = res.data.responseObject.data;
            }).catch(function (err) {
                vm.log(err);
            });
        },
        /**
         * 挂单
         */
        setStoreList: function () {
            var storeList = [];
            var list = [];
            if (this.calculateGoodsList.length == 0) {
                this.toast(false,'暂无可挂单列表');
                return;
            }
            if (localStorage.getItem('storeList')) {
                storeList = JSON.parse(localStorage.getItem('storeList'));
            }
            this.calculateGoodsList.forEach(function (item) {
                list.push(item);
            });
            storeList.push({
                orderNum: new Date().getTime(),
                totalMoney: this.totalMoney,
                list: list
            });
            localStorage.setItem('storeList', JSON.stringify(storeList));
            this.calculateGoodsList = [];
        },
        /**
         * 获取挂单列表
         */
        getStoreList: function () {
            if (localStorage.getItem('storeList')) {
                this.storeList = JSON.parse(localStorage.getItem('storeList'));
            }
        },
        /**
         * 获取商家分类列表
         */
        getCategoryList: function () {
            var vm = this;
            axios.post('rpcShop/queryshopCategoryList', vm.stringifyParams({
                shopCode: vm.shopCode
            })).then(function (res) {
                vm.categoryList = res.data.responseObject.data;
                vm.switchSubTab(vm.categoryList[0].categoryCode);
            }).catch(function (err) {
                vm.log(err);
            });
        },
        /**
         * 获得需要语音合成的文字
         */
        getText: async function () {
            var vm = this;
            if (vm.isPlayOver) {
                await axios.post('rpcShop/queryOrderList', this.stringifyParams({
                    shopCode: vm.shopCode,
                    isVoice: 0
                })).then(function (data) {
                    if(data.data.responseObject.data.length == 0) {
                        vm.getText();
                        return;
                    }
                    data.data.responseObject.data.forEach(function (item, index, array) {
                        (async function (i) {
                            var msg = new SpeechSynthesisUtterance(item.message);
                            speechSynthesis.speak(msg);
                            await axios.post('rpcShop/updateShopOrder', vm.stringifyParams({
                                orderCode: item.orderCode,
                                isVoice: 1
                            })).then(function (res) {
                                if (res.data.successFlag == 0) {
                                    if (i == array.length - 1) {
                                        // 最后一条更新完毕
                                        vm.isPlayOver = true;
                                        // 递归
                                        vm.getText();
                                    } else {
                                        vm.isPlayOver = false;
                                    }
                                }
                            }).catch(function (err) {
                                vm.log(err);
                            });
                        })(index);
                    });
                }).catch(function (err) {
                    vm.log(err);
                });
            }
        },
        /**
         * 获取商家产品
         */
        getGoodsByCategory(categoryCode) {
            var vm = this;
            if (vm.goodsListPage == 1) {
                vm.goodsList = [];
            }
            axios.post('rpcShop/queryshopProductPage', vm.stringifyParams({
                shopCode: vm.shopCode,
                categoryCode: categoryCode,
                currentPage: vm.goodsListPage
            })).then(function (res) {
                if (res.data.successFlag == 0) {
                    if (res.data.responseObject.data.data.length < vm.pageSize) {
                        vm.isMoreGoods = false;
                    }
                    vm.goodsList = vm.goodsList.concat(res.data.responseObject.data.data);
                }
            }).catch(function (err) {
                vm.log(err);
            });
        },
        /**
         * 获取订单列表 type==>1线上，type==>0线下
         * @param {number} type 
         */
        getOrderList: function (type) {
            var vm = this;
            axios.post('rpcShop/queryshopOrder', vm.stringifyParams({
                shopCode: vm.shopCode,
                currentPage: type == 1 ? vm.orderListOnlinePage : vm.orderListOfflinePage,
                orderStatus: 0,
                transWayIndex: type
            })).then(function (res) {
                if (res.data.successFlag == 0) {
                    if (type == 0) {
                        //线下订单
                        if (vm.orderListOfflinePage == 1) {
                            vm.orderListOffline = [];
                        }
                        if (vm.orderListOffline.length < vm.pageSize) {
                            vm.isMoreOfflineOrder = false;
                        }
                        vm.orderListOffline = vm.orderListOffline.concat(res.data.responseObject.data.data);
                        if (vm.orderListOffline.length != 0 && vm.currentOrderOffline == -1) {
                            vm.orderDetailOffline = vm.orderListOffline[0];
                            vm.currentOrderOffline = vm.orderDetailOffline.id;
                        }
                    } else {
                        // 线上订单
                        if (vm.orderListOnlinePage == 1) {
                            vm.orderListOnline = [];
                        }
                        if (vm.orderListOnline.length < vm.pageSize) {
                            vm.isMoreOnlineOrder = false;
                        }
                        vm.orderListOnline = vm.orderListOnline.concat(res.data.responseObject.data.data);
                        if (vm.orderListOnline.length != 0 && vm.currentOrderId == -1) {
                            vm.orderDetailOnline = vm.orderListOnline[0];
                            vm.currentOrderId = vm.orderDetailOnline.id;
                        }
                    }
                } else {
                    alert('获取订单列表失败');
                }
            }).catch(function (err) {
                vm.log(err);
            });
        },
        /**
         * 警告/提示框
         * @param {string} type 类型：success,warn
         * @param {string} msg 文字
         */
        toast: function (isSuccess, msg) { 
            var vm = this;
            vm.isSuccess = isSuccess;
            vm.tips =msg;
            vm.isShowTips = true;
            setTimeout(function() {
                vm.isShowTips = false;
            },1500);
        },
        /**
         * 图片加载失败触发
         * @param {event} e 
         */
        onImgError: function (e) {
            e.target.src = '../images/goods.png';
        }
    },
    computed: {
        totalMoney: function () {
            var money = 0;
            this.calculateGoodsList.forEach(function (item) {
                money += parseFloat(item.totalPrice);
            });
            return parseFloat(money).toFixed(2);
        }
    },
    filters: {
        filterTime: function (timestamp) {
            var date = new Date(timestamp);
            var year = date.getFullYear();
            var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
            var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return year + '-' + month + '-' + day + ' ' + hour + ' : ' + minute + ' : ' + second;
        }
    },
    watch: {
        calculateGoodsList: function () {
            var vm = this;
            vm.$nextTick(function () {
                vm.$refs.calculater.scrollTop = vm.$refs.calculater.scrollHeight;
            });
        }
    },
    created: function () {
        var vm = this;
        axios.defaults.baseURL = 'http://52.83.136.234:15555/qxg';
        // vm.getText();
        vm.setSwitch();
        vm.getCurrentTime();
        setInterval(function () {
            vm.getCurrentTime();
        }, 1000);
        //监测秤的重量变化
        // vm.getWeight();
        vm.login();
        vm.getCategoryList();
        // 展示挂单列表
        vm.getStoreList();
        // 开始监听
        vm.$nextTick(function () {
            vm.watchScroll(vm.$refs.goodsWrapper, vm.$refs.goodsMore, function () {
                if (vm.isMoreGoods) {
                    vm.goodsListPage++;
                    vm.getGoodsByCategory(vm.subCurrentIndex);
                }
            });
            vm.watchScroll(vm.$refs.onlineWrapper, vm.$refs.onlineMore, function () {
                if (vm.isMoreOnlineOrder) {
                    vm.orderListOnlinePage++;
                    vm.getOrderList(1);
                }
            });
            vm.watchScroll(vm.$refs.offlineWrapper, vm.$refs.offlineMore, function () {
                if (vm.isMoreOfflineOrder) {
                    vm.orderListOfflinePage++;
                    vm.getOrderList(0);
                }
            });
        });

    }
});