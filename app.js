//BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum +=curr.value;
        });
        data.totals[type] = sum;

    };
    var data = {
        allItems : {
            exp : [],
            inc : [],
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
    }
    return {
        addItem : function(type, des, val){
            var newItem, ID;
            //id = last id +1;
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length-1].id +1
            }
            else{
                ID = 0;
            }
            // create a new item
            if(type === 'exp' ){
                newItem = new Expense(type, des, val);
            }
            else if( type === 'inc'){
                newItem = new Income(type, des, val);
            }
            //push it into the ds
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        //calculate budget
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
            //caluculate the percentage spent
            if(data.totals.inc > 0){
                data.percentage = Math.round(data.totals.exp / data.totals.inc) * 100;
            }
            else {
                data.percentage = -1
            }
            

        },

        getBudget: function() {
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        }
    };

})();

//UI CONTROLLER
var UIController = (function(){
    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage'
    }
    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value,//inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem : function(obj, type){
            var html, newHtml, element;
            //create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //replace the placeholder with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        //clear fields
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription 
                +', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current){
                current.value = "";

            });
            fieldsArr[0].focus();

        },
        displayBudget: function(obj){
                document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
                document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
               if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage ='%';
               }
               else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
               }
        },
        getDOMstrings : function(){
            return DOMStrings;
        }
    }
})();

//UPDATE BUDGET FUNCTION
var updateBudget = function() {
    // 1. Calculate the budget
    budgetController.calculateBudget();

    // 2. Return the budget
    var budget = budgetController.getBudget();

    // 3. Display the budget on the UI
    UIController.displayBudget(budget);
}


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl){
    var setupEventListeners = function(){
        document.querySelector(UICtrl.getDOMstrings().inputBtn).addEventListener('click',ctrlAddItem),
        document.addEventListener('keypress',function(event){
            if(event.keyCode ===13){
                console.log('Enter pressed');
                ctrlAddItem();
            }
        })
    }
    var ctrlAddItem = function(){

    var input, newItem;
    // 1. Get the input data from the field
    input = UICtrl.getInput();
    
    if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
         // 2. Add item to the budger controller
       newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    

    // 3. Add item to the UI
        UICtrl.addListItem(newItem,input.type);
    // 4. Clear the fields
        UICtrl.clearFields();
    // 5. Calculate and update budget
        updateBudget();

    }


    }

    return {
        init : function(){
            console.log('App Started')
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            })
            setupEventListeners();
        }
    }

})(budgetController,UIController);

controller.init();
