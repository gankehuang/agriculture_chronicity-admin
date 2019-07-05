<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>&nbsp;&nbsp;关于我们</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              
              <el-form-item label="通知公告" prop="Content">
                <el-input type="textarea" v-model="ruleForm.Content"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
        </div>

        
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        name: 'aboutus',
        data() {
            return {
                type: 4,
                ruleForm: {
                  Content: '',
                  Id: ''
                },
                rules: {
                  Content: [
                    { required: true, message: '请填写通知公告', trigger: 'blur' }
                  ]
                }
            }
        },
        created() {
            
            
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    
                })
            }
        },
        methods: {
           
            // 获取数据
            getData() {
                this.$axios.get( this.global.API.DataManageService.GetAllData, 
                    { params: { "draw": 0, 'start': 0, 'length': 10, 'retrievalInfo': JSON.stringify({'Type': this.type}) }}
                ).then((res) => {
                    let resData = JSON.parse(JSON.parse(res.data.resultData).data);
                    console.log(resData);
                    this.ruleForm.Content = resData[0].Content;
                    this.ruleForm.Id = resData[0].Id;
                })
            },
            
            

            // 保存编辑
            submitForm(form) {
                //this.$set(this.tableData, this.idx, this.form);
                //console.log(this.form);
                this.$refs[form].validate((valid) => {
                    if(valid) {
                        console.log(valid);
                        let sendData = this.ruleForm;
                        sendData.Type = this.type;
                        console.log(sendData);
                        this.$axios.get( this.global.API.DataManageService.AddorEditData, {  
                            params: {"ID": this.ruleForm.Id, 'jsonStr': JSON.stringify(sendData)}
                        }).then(res => {
                            if(res.data.success == 1) {
                                this.editVisible = false;
                                this.$message.success(res.data.message);
                                this.getData();
                            }else{
                                this.$message.success(res.data.message);
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
            
        },
        watch: {
            
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
