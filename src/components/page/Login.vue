<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">国家农业基础性长期性科技工作信息网管理后台</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">{{tips}}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data: function(){
            return {
                tips: 'Tips :密码建议使用6个以上字符。',
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    console.log(valid);
                    //console.log(this.global);
                    if (valid) {
                        //console.log( api )
                        //console.log( api+'/RecipeManageService.asmx/Login' );
                        this.$axios.get( this.global.API.UserManageService.Login, {    // this.global.API.UserManageService.Login
                            params: this.ruleForm
                        })
                        .then( (response) => {
                            if(response.data.success == 1) {
                                localStorage.setItem('ms_username', this.ruleForm.username);
                                this.$router.push('/');
                            } else {
                                this.tips = response.data.message;
                            }
                            
                            console.log(response);
                        })
                        .catch( (error) => {
                            console.log(error);
                        });
                        
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 30px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>