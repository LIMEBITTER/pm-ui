<template>
    <div>
                <el-form  label-width="100px" size="small" :model="form" :rules="addFormRules" ref="ruleForm" class="myForm">
                    <el-form-item label="所属小区名称" prop="communityName" size="large">
                        <el-input v-model="form.communityName" autocomplete="off" ></el-input>
                    </el-form-item>

                  <el-form-item label="投诉人员" prop="ownerName" size="large">
                    <el-input v-model="form.ownerName" autocomplete="off" ></el-input>
                  </el-form-item>
<!--                    <el-form-item label="性别" prop="sex" size="large">-->
<!--                        <el-radio-group v-model="form.sex">-->
<!--                            <el-radio label="男" value="男"></el-radio>-->
<!--                            <el-radio label="女" value="女"></el-radio>-->
<!--                        </el-radio-group>-->
<!--                    </el-form-item>-->
                    <!--年龄验证不为空-->
                    <el-form-item label="投诉名称" prop="age" size="large">
                        <el-input v-model="form.descriptionName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="投诉事由" prop="address" size="large">
                        <el-input v-model="form.reason" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer" id="footer">
                    <el-button type="primary" @click="onSubmit" :loading="verifyStatus" size="large" >提 交</el-button>
                </div>
                <span style="color: red">{{verifyText}}</span>



    </div>
</template>

<script>
    import {addComplaint} from "../../api/property/complaint.js";
    import Stomp from 'stompjs';
    export default {
        name: "complaintInfo",
        data(){
            //验证年龄
            let checkAge = (rule, value, callback) => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'));
                }else {
                    callback()
                }
            };
            //验证电话
            let checkPhone = (rule, value, callback) => {
                let reg = /^1[345789]\d{9}$/
                if (!reg.test(value)) {
                    callback(new Error('请输入11位手机号'))
                } else {
                    callback()
                }
            }
            return{
                name: "",
                address: "",
                //嵌套表单
                form:{},
                addFormRules:{
                    // name:[
                    //     {required:true,message:'请输入姓名',trigger:'blur'},
                    //     {min:2,max:10,message: '长度在2到10个字符',trigger: 'blur'}
                    // ],
                    // sex:[
                    //     {required:true,message:'请选择性别',trigger:'change'},
                    // ],
                    // age:[
                    //     {required:true,type:'number',validator:checkAge,trigger:'blur'},
                    // ],
                    // address:[
                    //     {required:true,message:'请输入地址',trigger:'blur'},
                    //     {min:3,max:50,message: '长度在3到50个字符',trigger: 'blur'}
                    // ],
                    // tel:[
                    //     {required:true,type:'number',validator:checkPhone,trigger:'blur'}
                    // ],
                    // localPeople:[
                    //     {required:true,message:'请选择类别',trigger:'change'},
                    //
                    // ]


                },

              client:null


            }
        },
        created() {
          this.connect();

        },
        methods:{
            onSubmit(){
                //表单校验
                this.$refs['ruleForm'].validate(valid=>{
                    console.log('表单校验',valid)
                    if(valid){
                        console.log('表单合法！',this.form)
                        addComplaint(this.form).then(res =>{
                            //判断是否保存成功
                          console.log(res)
                          if (res.code==20000){
                            this.$message.success("投诉成功");
                          }
                          this.form={}

                        })
                    }else{
                        console.log("表单格式非法!")
                      this.$message.info("表单格式非法")

                    }
                })

            },


          //webSocket连接成功后回调函数
          onConnected(frame) {
            console.log("Connected: " + frame);
            //绑定交换机exchange_pushmsg是交换机的名字rk_pushmsg是绑定的路由key
            var exchange = "/exchange/exchange_pushmsg/rk_pushmsg";
            //创建随机队列用上面的路由key绑定交换机,放入收到消息后的回调函数和失败的回调函数
            this.client.subscribe(exchange, this.responseCallback, this.onFailed);
            console.log(frame)
          },
          onFailed(frame) {
            console.log("Failed: " + frame);
          },
          responseCallback(frame) {
            console.log("得到的消息 msg=>" + frame.body);
            console.log(frame)
            //接收到服务器推送消息，向服务器定义的接收消息routekey路由rk_recivemsg发送确认消息
            this.client.send("/exchange/exchange_pushmsg/rk_recivemsg", {"content-type":"text/plain"}, frame.body);
          },
          connect() {
            //这里填你rabbitMQ的连接ip地址直接替换localhost:15674就好其它的不用改
            this.client= Stomp.client("ws://localhost:15674/ws")
            //填写你rabbitMQ登录的用户名和密码
            var headers = {
              "login": "guest",
              "password": "guest",
              //虚拟主机，默认“/”
              "host": "/"
            };
            //创建连接,放入连接成功和失败回调函数
            this.client.connect(headers, this.onConnected, this.onFailed);
          },


        }
    }
</script>

<style scoped>
    #container {
        margin: 0 350px;
    }
    #footer{
        text-align: center;
    }

.el-input{
    width: 500px;
}

</style>
