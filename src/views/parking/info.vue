<template>
  <div class="app-container">

    <el-form :inline="true" :model="pageInfo" class="demo-form-inline">
      <el-form-item label="车位编号">
        <el-input v-model="pageInfo.queryString" placeholder="车位编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="this.findPage">查询</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="handleCreate()">新增角色</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="communityName"
        label="所属小区"
        width="180">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="ownerName"-->
<!--        label="正在使用的业主">-->

<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="picture"-->
<!--        label="车位图片">-->
<!--      </el-table-column>-->

      <el-table-column
        prop="code"
        label="车位编号">
      </el-table-column>

      <el-table-column
          prop="name"
          label="车位名称">
      </el-table-column>

      <el-table-column
          prop="status"
          label="状态">
        <template v-slot="scope">
          <div v-if="scope.row.status==0">未使用</div>
          <div v-else>正在使用</div>

        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="primary"
              @click="showDetail(scope.$index, scope.row)">详情</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>

    <el-dialog title="新增/编辑停车位信息" :visible.sync="dialogFormVisible" @close="resetForm()">
      <el-form :model="form" ref="formRef">
        <el-form-item label="所属小区" :label-width="formLabelWidth">
          <el-select v-model="form.communityId" placeholder="请选择小区" >
            <el-option v-for="(item,index) in communityNameList" :key="item.id" :label="item.communityName" :value="item.id" ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="车位图片" :label-width="formLabelWidth">-->
<!--          <el-input v-model="form.picture" autocomplete="off"></el-input>-->

<!--        </el-form-item>-->
        <el-form-item label="车位编号" :label-width="formLabelWidth">
          <el-input v-model="form.code" autocomplete="off"></el-input>

        </el-form-item>
        <el-form-item label="车位名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList ,updateParkingInfo,addParking,deleteParking} from '@/api/parking/info.js'
import {getCommunityList} from "@/api/owner/info.js";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,

      tableData:[],
      communityNameList:[],
      pageInfo:{
        currentPage:1,
        pageSize:5,
        queryString:'',
        total:0
      },
      form:{
        id:'',
        communityName: '',
        communityId:0,
        // picture:'',
        code:'',
        name:'',
      },
      dialogFormVisible:false,
      formLabelWidth: '120px'
    }
  },
  created() {
    // this.fetchData()
    this.getCommunityLists();
    this.findPage();

  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPageList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    showDetail(index,row){
      console.log('详情信息',index,row)
      if (row.ownerName!=-1){
        this.$message.success("正在使用的业主是： "+row.ownerName)
      }else {
        this.$message.info("该车位未被使用！")
      }
    },
    //获取所有小区的名称
    getCommunityLists(){
      var self = this;

      getCommunityList().then(function (res) {
        console.log('getCommunityLists',res.data)
        self.communityNameList = res.data.map(item=>({
          id:item.id,
          communityName:item.name
        }));

      })
    },


    getAllOwners(){
      var self = this;
      getPageList().then(function (res){
        self.tableData = res.data
      })
    },
    // 每页显示条数
    handleSizeChange(pageSize){
      //更新参数值
      this.pageInfo.pageSize = pageSize;
      //返回更新后的数据
      this.findPage();

    },
    //当前页发生改变触发
    handleCurrentChange(currentPage){
      this.pageInfo.currentPage = currentPage
      this.findPage()

    },
    findPage(){
      //向后台传递数据
      var self = this;
      var param = {
        currentPage:this.pageInfo.currentPage,
        pageSize:this.pageInfo.pageSize,
        queryString:this.pageInfo.queryString,
      }
      getPageList(param).then(function (res){
        console.log('parkinginfo',res);
        self.tableData = res.data.records;
        self.pageInfo.total = res.data.total;
      })
    },

    handleCreate(){
      this.dialogFormVisible = true;
    },
    onSubmit(){
      let self = this;
      //判断form数据模型里id有没有值
      console.log('新增/修改按钮==========',self.form.id)
      if (self.form.id==undefined){
        console.log('=========undefined=========')
        self.form.id='';
      }
      if (self.form.id!=''){
        //不为空，id有值，进行修改操作
        console.log('=========修改==========')
        var param={
          id:this.form.id,
          communityId:this.form.communityId,
          // picture:this.form.picture,
          code:this.form.code,
          name:this.form.name,
        }
        updateParkingInfo(param).then(function (res){
          //更新数据操作
          self.findPage();
          //关闭弹层
          self.dialogFormVisible = false;
          //重置表单数据
          self.form={};
          if(res.code==20000){
            self.$message({
              message: '恭喜你，修改停车位信息成功',
              type: 'success'
            });
          }else{
            self.$message.error('错了哦，修改停车位信息失败');

          }
        })
      }else{
        //得到form表单内容，封装为一个新的对象，传递到controller层
        var param={
          communityId:this.form.communityId,
          //默认停车位未被使用
          ownerId: -1,
          status:0,
          // picture:this.form.picture,
          code:this.form.code,
          name:this.form.name,
        }
        addParking(param).then(function (res){
          //更新数据操作
          self.findPage();
          //关闭弹层
          self.dialogFormVisible = false;
          if(res.code==20000){
            self.$message({
              message: '恭喜你，添加停车位成功',
              type: 'success'
            });
          }else{
            self.$message.error('错了哦，添加停车位失败');

          }
        })
      }

    },

    handleEdit(index, row) {
      // alert(index, row);
      this.form = row
      this.dialogFormVisible = true;

    },
    handleDelete(index, row) {
      let self = this;

      //二次删除确认
      this.$confirm('此操作将永久删除该行数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // alert(index, row);
        deleteParking(row.id).then(function (res){
          //刷新数据
          self.findPage();
          if (res.code==20000){
            self.$message({
              message: '删除停车位成功',
              type: 'success'
            });
          }else{
            self.$message.error('删除停车位失败');
          }

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });





    },

    //关闭对话框后清空表单数据
    resetForm(){
      //重置form表单
      this.form={}
    }


  }
}
</script>
