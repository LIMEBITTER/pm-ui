<template>
    <div class="wrapper">
        <div style="margin: 100px auto; background-color: #fff; width: 350px; height: 400px; padding: 20px; border-radius: 10px">
            <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>注 册</b></div>
            <el-form :model="role" :rules="rules" ref="roleForm">
                <el-form-item prop="rolename">
                    <el-input placeholder="请输入账号" size="medium" style="margin: 5px 0" prefix-icon="el-icon-role" v-model="role.rolename"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="role.password"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input placeholder="请确认密码" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="role.confirmPassword"></el-input>
                </el-form-item>
                <el-form-item style="margin: 5px 0; text-align: right">
                    <el-button type="primary" size="small"  autocomplete="off" @click="login">注册</el-button>

                    <el-button type="warning" size="small"  autocomplete="off" @click="$router.push('/login')">返回登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                role: {
                    rolename:"",
                    password:"",
                    confirmPassword:""
                },
                rules: {
                    rolename: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            login() {
                this.$refs['roleForm'].validate((valid) => {
                    if (valid) {  // 表单校验合法
                        if (this.role.password !== this.role.confirmPassword) {
                            this.$message.error("两次输入的密码不一致")
                            return false
                        }
                        //传输至后端校验
                        this.request.post("/community/estateManager/register", this.role).then(res => {
                            if(res.code === 20000) {
                                console.log("role", res.data)
                                this.$message.success("注册成功")
                                this.$router.push('/login')
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style>
    .wrapper {
        height: 100vh;
        /*background-image: url("src/assets/background.jpeg");*/
      background-color: #909399;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
    }
</style>
