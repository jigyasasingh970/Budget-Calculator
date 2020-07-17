//BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var data = {
        allItems : {
            exp : [],
            inc : [],
        },
        totals : {
            exp : 0,
            inc : 0
        }
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
        }
    }

 

})();

//UI CONTROLLER
var UIController = (function(){
    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn'
    }
    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value,//inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMstrings : function(){
            return DOMStrings;
        }
    }
})();


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
    console.log(input);
    // 2. Add item to the budger controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add item to the UI

    // 4. Clear the fields

    // 5. Calculate the budget

    // 6. Display the budget on the UI

    }

    return {
        init : function(){
            console.log('App Started')
            setupEventListeners();
        }
    }

})(budgetController,UIController);

controller.init();