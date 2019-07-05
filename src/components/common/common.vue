<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>&nbsp;&nbsp;{{type}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="新闻标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
                <el-button type="primary" icon="el-icon-document" @click="all">全部</el-button>
            </div>


            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="Title" label="标题" sortable ></el-table-column>
                <el-table-column prop="Synopsis" label="简介" ></el-table-column>
                <el-table-column prop="Time" label="时间"></el-table-column>

                <el-table-column label="图片" width="180" align="center">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.Picture"
                          style="width: 100px;"
                          :src="scope.row.Pic"
                          ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next, total" :total="title">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="标题" prop="Title">
                    <el-input v-model="form.Title"></el-input>  
                </el-form-item>
                <el-form-item label="简介" prop="Synopsis">
                   <el-input v-model="form.Synopsis"></el-input>
                </el-form-item>
                <el-form-item label="时间" prop="Time">
                    <el-input v-model="form.Time"></el-input>
                </el-form-item>
                <!-- <el-form-item label="推荐" prop="Recommend">
                    <el-select v-model="form.Recommend" placeholder="请选择">
                        <el-option label="推荐" value="1"></el-option>
                        <el-option label="不推荐" value="0"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="内容上传">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :limit="1"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :file-list="fileList"
                      :on-success="uploadSuccess"
                      list-type="picture">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="图片上传">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl1"
                      :limit="1"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :file-list="fileListPic"
                      :on-success="uploadSuccess1"
                      list-type="picture">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        name: 'common',
        data() {
            return {
                type: '数据中心', 
                typeNum: '1-1-2',

                title: 10,
                fileList: [],  //上传新闻内容
                fileListPic: [],  //新闻图片

                uploadUrl: this.global.API.UploadManageService.UploadAll + '?type=2&oldPath=""', //文件上传路径
                uploadUrl1: this.global.API.UploadManageService.UploadAll + '?type=1&oldPath=""', //图片上传路径

                tableData: [],  //表格数据
                cur_page: 0,    //翻页页码
                multipleSelection: [],
                select_word: '',  //菜名
                del_list: [],
                editVisible: false,
                delVisible: false,
                form: {
                    Id: '',      
                    Title: '',
                    Synopsis: '',
                    Time: '',
                    Content: '',
                    Picture: '',
                    Recommend: ''
                },
                rules: {
                    Title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    Synopsis: [
                        { required: true, message: '请输入简介', trigger: 'blur' }
                    ]
                },
                idx: -1,
                delId: '',
            }
        },
        props: {
            typeOnly: String
        },
        created() {
            //console.log(this.typeOnly)
          
            let msg = this.typeOnly;
            this.typeNum = msg;
            if(msg == '1-1-1'){
                this.type = '共享联盟';
            }else if(msg == '1-1-2'){
                this.type = '数据中心'
            }else if(msg == '1-1-3'){
                this.type = '实验站点'
            }else if(msg == '1-2'){
                this.type = '专家队伍'
            }else if(msg == '2-1'){
                this.type = '各中心监测任务'
            }else if(msg == '2-2-1'){
                this.type = '用户手册'
            }else if(msg == '2-2-2'){
                this.type = '汇交系统FAQ'
            }else if(msg == '2-3'){
                this.type = '应用案例'
            }
      


            if(this.fileList[0]){
                this.uploadUrl = this.global.API.UploadManageService.UploadAll + '?type=2&oldPath=' + this.fileList[0].url;
            } else{
                this.uploadUrl = this.global.API.UploadManageService.UploadAll + '?type=2&oldPath=""';
            }
            if(this.fileListPic[0]){
                this.uploadUrl1 = this.global.API.UploadManageService.UploadAll + '?type=1&oldPath=' + this.fileListPic[0].url;
            } else{
                this.uploadUrl1 = this.global.API.UploadManageService.UploadAll + '?type=1&oldPath=""';
            }


            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    
                })
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            uploadSuccess(response, file, fileList) {  //上传内容成功回调
                console.log(response)
                if(response.success == 0) {
                    this.$message.warning(response.message);
                    this.fileList = [];
                }else if(response.success == 1) {
                    this.form.Content = JSON.parse(response.resultData)[0].Url
                }
                //console.log(JSON.parse(response.resultData)[0].Url);
                
            },
            uploadSuccess1(response, file, fileList) {  //上传图片成功回调
                console.log(JSON.parse(response.resultData)[0].Url);
                this.form.Picture = JSON.parse(response.resultData)[0].Url
            },

            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = (val-1)*10;
                console.log((val-1)*10+1);
                this.getData();
            },
            // 获取数据
            getData() {
                
                this.$axios.get( this.global.API.DataManageService.GetAllData, 
                    {  
                        params: {"draw": 0, 
                        'start': this.cur_page, 
                        'length': 10, 
                        'retrievalInfo': JSON.stringify({'Type': this.typeNum, 'Title': this.select_word})}
                    }
                ).then((res) => {
                    let resData = JSON.parse(JSON.parse(res.data.resultData).data);
                    this.title = JSON.parse(res.data.resultData).recordsTotal;

                    for(let i=0; i<resData.length; i++) {
                        if(resData[i].Picture){
                            //resData[i].Pic = resData[i].Picture;
                            resData[i].Pic = this.global.Domain.resource + resData[i].Picture;
                        }
                    }
                    this.tableData = resData;
                    console.log(resData);
                })
            },
            search() {
                this.getData();
            },
            all() {
                this.select_word = '';
                this.getData();
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                console.log(item);
                this.form = {
                    
                    Id: item.Id,      
                    Title: item.Title,
                    Synopsis: item.Synopsis,
                    Time: item.Time,
                    Content: item.Content,
                    Picture: item.Picture,
                    Recommend: item.Recommend+''
                }
                if(item.Picture){
                    this.fileListPic = [{name: item.Picture, url: item.Pic}]
                }else {
                    this.fileListPic = []
                }
                
                if(item.Content){
                    this.fileList = [{name: item.Content, url: item.Content}]
                }else {
                    this.fileList = []
                }
                
                this.editVisible = true;
            },
            add() {
                this.fileListPic = [];
                this.fileList = [];
                this.form = {
                    Id: '',      
                    Title: '',
                    Synopsis: '',
                    Time: '',
                    Content: '',
                    Picture: '',
                    Recommend: ''
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.delId = row.Id;
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {  //批量删除
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].Id + ',';
                }
                str = str.slice(0,str.length-1); 
                this.$axios.get( this.global.API.DataManageService.DelData, {
                    params: {"id": str }
                }).then(res => {
                    if(res.data.success == 1) {
                        this.$message.success('删除成功');
                        this.multipleSelection = [];
                        this.getData();
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit(form) {
                //this.$set(this.tableData, this.idx, this.form);
                
                this.$refs[form].validate((valid) => {
                    if(valid) {
                        if(this.form.Picture){
                            let sendData = this.form;
                            sendData.Type = this.typeNum;
                            console.log(sendData);

                            this.$axios.get( this.global.API.DataManageService.AddorEditData, {     
                                params: {"ID": this.form.Id, 'jsonStr': JSON.stringify(sendData)}
                            }).then(res => {
                                //console.log(res);
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
                        }else {
                            this.$message.warning('请上传图片');
                        }
                        
                    }
                })
 
            },
            // 确定删除
            deleteRow(){
                this.$axios.get( this.global.API.DataManageService.DelData, {
                    params: {"id": this.delId }
                }).then(res => {
                    //console.log(res);
                    if(res.data.success == 1) {
                        this.tableData.splice(this.idx, 1);
                        this.$message.success('删除成功');
                        this.delVisible = false;
                    }
                }).catch(error => {
                    console.log(error);
                })

                
            }
        },
        watch: {
            type: function(){
                this.cur_page = 0;
                this.select_word = '';
                this.getData();

            },
            select_word: function() {
                this.getData();
            }
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
