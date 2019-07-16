new Vue({
    el: '#app',
    data: {
        currentTime: '0000-00-00 00:00:00',
        currentIndex: 0,
        subCurrentIndex: 0,
        onlineCurrentIndex: 0,
        offlineCurrentIndex: 0,
        currentOrder: 1,
        currentOrderOffline: 1,
        currentOrderDialog: 1,
        isShowDialog: false,
        dialogTitle: '',
        dialogIndex: 0, //0==>挂单，1==>结算，2==>扫码，3==>非水果，4==>设置
        isOpen: false,
        shopCode:'HP8097021061',
        shopPwd:'123',
        // 是否开启调试模式
        isDeug:true,
        // 分类列表
        categoryList:[]
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
            this.currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        },
        /**
         * 切换顶部tab
         * @param {number} index 
         */
        switchTab: function (index) {
            if (this.currentIndex != index) {
                this.currentIndex = index;
            }
        },
        /**
         *切换开关 
         */
        toggleOpen: function () {
            this.isOpen = !this.isOpen;
            localStorage.setItem('isOpen', this.isOpen.toString());
        },
        /**
         * 切换结算区右侧tab
         * @param {number} index 
         */
        switchSubTab: function (index) {
            if (this.subCurrentIndex != index) {
                this.subCurrentIndex = index;
                this.getProductsByCategory(index);
            }
        },
        /**
         * 切换在线订单接单/未接单tab
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
         * @param {number} currentOrder 
         */
        getOrderDetail: function (onlineCurrentIndex, currentOrder) {
            if (this.onlineCurrentIndex != onlineCurrentIndex || currentOrder != this.currentOrder) {
                this.onlineCurrentIndex = onlineCurrentIndex;
                this.currentOrder = currentOrder;
            }
        },
        /**
         * 切换支付/未支付子列表
         * @param {number} onlineCurrentIndex 
         * @param {number} currentOrder 
         */
        getOrderDetailOffline: function (offlineCurrentIndex, currentOrder) {
            if (this.offlineCurrentIndex != offlineCurrentIndex || currentOrder != this.currentOrderOffline) {
                this.offlineCurrentIndex = offlineCurrentIndex;
                this.currentOrderOffline = currentOrder;
            }
        },
        /**
         * 切换挂单列表里的订单
         * @param {number} currentOrderDialog 
         */
        getOrderDetailDialog: function (currentOrderDialog) {
            if (this.currentOrderDialog != currentOrderDialog) {
                this.currentOrderDialog = currentOrderDialog;
            }
        },
        /**
         * 打印小票
         * @param {number} type
         */
        printTick: function () {

        },
        /**
         * 根据type显示不同的dialog
         * @param {number} type 
         */
        showDialog: function (type) {
            this.isShowDialog = true;
            this.dialogIndex = type;
            switch (type) {
                case 0:
                    // 挂单
                    this.dialogTitle = '挂单';
                    break;
                case 1:
                    // 结算
                    this.dialogTitle = '结算';
                    break;
                case 2:
                    // 扫码
                    this.dialogTitle = '结算';
                    break;
                case 3:
                    // 非水果
                    this.dialogTitle = '非水果类商品';
                    break;
                case 4:
                    // 设置
                    this.dialogTitle = '设置';
                    break;
            }
        },
        /**
         * 关闭dialog
         */
        closeDialog: function () {
            this.isShowDialog = false;
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
            console.log(this.takePhoto());
        },
        /**
         * 获得媒体失败回调
         * @param {*} error 
         */
        error: function (error) {
            console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
        },
        /**
         * 拍照
         */
        takePhoto: function () {
            var canvas = document.createElement('canvas');
            canvas.width = 480;
            canvas.height = 320;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this.$refs.videoPlayer,0,0);
            var base64Data = canvas.toDataURL();
            return this.dataURLtoFile(base64Data);
        },
        /**
         * base64字符串转File对象
         * @param {string} dataurl
         */
        dataURLtoFile: function(dataurl) { //将base64转换为文件
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
            setInterval(function () {
                axios.get("http://127.0.0.1:5017/api/Scale/Weight").then(function (data) {
                    if (data.data.IsSteady == 1) {
                        // 已经稳定
                        console.log(data.data.Weight.toFixed(3));
                    }
                }).catch(function (err) {
                    console.log(err);
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
            axios.post('rpcShop/querOneShop', this.stringifyParams({
                shopCode: this.shopCode,
                shopPwd: this.shopPwd
            })).then(function (res) {

            }).catch(function (err) {

            });
        },
        /**
         * 获取商家分类列表
         */
        getCategoryList: function () {
            var vm = this;
            axios.post('rpcShop/queryshopCategoryList',this.stringifyParams({
                shopCode:this.shopCode
            })).then(function(res) {
                vm.categoryList = res.data.responseObject.data;
                vm.switchSubTab(vm.categoryList[0].categoryCode);
            }).catch(function(err) {
                
            });
        },
        /**
         * 获取商家产品
         */
        getProductsByCategory(categoryCode) {
            axios.post('rpcShop/queryshopProductPage',this.stringifyParams({
                shopCode:this.shopCode,
                categoryCode:categoryCode,
                currentPage:1
            })).then(function() {

            }).catch(function(err) {
                vm.log(err);
            });
        }
    },
    log:function(msg) {
        if(this.isDeug) {
            console.log(msg);
        }
    },
    created: function () {
        axios.defaults.baseURL = 'http://52.83.136.234:15555/qxg';
        var vm = this;
        vm.getCurrentTime();
        setInterval(function () {
            vm.getCurrentTime();
        }, 1000);
        // this.getWeight();
        this.login();
        // this.getUserMedia({video : {width: 480, height: 320}}, this.success, this.error);
        this.getCategoryList();
    }
});