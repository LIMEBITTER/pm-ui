<template>
  <div class="app-container">

    <el-form :inline="true" :model="pageInfo" class="demo-form-inline">
      <el-form-item label="投诉名称">
        <el-input v-model="pageInfo.queryString" placeholder="投诉名称"></el-input>
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
        label="所属小区名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="ownerName"
        label="投诉人员（业主）">
      </el-table-column>
      <el-table-column
        prop="descriptionName"
        label="投诉名称">
      </el-table-column>

      <el-table-column
        prop="reason"
        label="投诉事由">
      </el-table-column>


      <el-table-column
          prop="status"
          label="状态">
        <template v-slot="scope">
          <div v-if="scope.row.status==1">未受理</div>
          <div v-else-if="scope.row.status==2">已受理</div>
          <div v-else>已回复</div>

        </template>
      </el-table-column>


      <el-table-column
          prop="answer"
          label="回复">
      </el-table-column>


      <el-table-column
        prop="updateTime"
        label="创建时间">
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.status==1"
            @click="resolveEvent(scope.$index, scope.row)">受理</el-button>
          <el-button
              size="mini"
              type="primary"
              v-if="scope.row.status==2"
              @click="showDialog(scope.$index, scope.row)">回复</el-button>
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

    <el-dialog title="投诉答复" :visible.sync="dialogFormVisible" @close="resetForm()">
      <el-form :model="asr" ref="formRef">

        <el-form-item label="投诉答复" :label-width="formLabelWidth">
          <el-input v-model="asr.answer" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="giveAnswer()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList ,updateComplaint,addComplaint,deleteComplaint} from '@/api/property/complaint.js'

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
      pageInfo:{
        currentPage:1,
        pageSize:5,
        queryString:'',
        total:0
      },
      form:{
        // id:'',
        // communityName: '',
        // ownerName:'',
        // descriptionName:'',
        // reason:'',
        // status:0,
        // answer: ''
      },
      asr:{
        answer:'',
      },

      dialogFormVisible:false,
      formLabelWidth: '120px'
    }
  },
  created() {
    // this.fetchData()
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

    showDialog(index,row){
      this.form=row
      this.dialogFormVisible = true;
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
        console.log('=======getPageList======',res);
        self.tableData = res.data.records;
        self.pageInfo.total = res.data.total;
      })
    },

    handleCreate(){
      this.dialogFormVisible = true;
    },
    //受理，状态status为1
    resolveEvent(index, row) {
      // alert(index, row);
      this.form = row
      // this.dialogFormVisible = true;
      console.log('========resolveEvent========',this.tableData)
      let self = this;

      var param={
        id:this.form.id,
        communityName: this.form.communityName,
        ownerName:this.form.ownerName,
        descriptionName:this.form.descriptionName,
        reason:this.form.reason,
        status:2,
      }
      console.log('===========',param)
      updateComplaint(param).then(function (res){
        //更新数据操作
        self.findPage();

        console.log('============成功===============',self.tableData)
        //关闭弹层
        // self.dialogFormVisible = false;
        //重置表单数据
        // self.form={};
        if(res.code==20000){
          self.$message({
            message: '恭喜你，受理信息成功',
            type: 'success'
          });
        }else{
          self.$message.error('错了哦，受理投诉信息失败');

        }
      })



    },

    giveAnswer(index,row){
      // alert(index, row);
      // this.form = row
      // this.dialogFormVisible = true;
      console.log('========giveAnswer========',this.form)
      let self = this;

      var param={
        id:this.form.id,
        answer:this.asr.answer,
        status:3,
      }

      console.log('=====454353453======',param)
      updateComplaint(param).then(function (res){
        //更新数据操作
        self.findPage();

        console.log('============成功===============',self.tableData)
        //关闭弹层
        self.dialogFormVisible = false;
        //重置表单数据
        self.form={};
        if(res.code==20000){
          self.$message({
            message: '恭喜你，受理信息成功',
            type: 'success'
          });
        }else{
          self.$message.error('错了哦，受理投诉信息失败');

        }
      })



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
        deleteComplaint(row.id).then(function (res){
          //刷新数据
          self.findPage();
          if (res.code==20000){
            self.$message({
              message: '删除投诉成功',
              type: 'success'
            });
          }else{
            self.$message.error('删除投诉失败');
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
