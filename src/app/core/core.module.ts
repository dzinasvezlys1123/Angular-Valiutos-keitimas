import { NgModule } from '@angular/core';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { ConverterComponent } from './routes/converter/converter.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConverterBlockComponent } from './routes/converter/components/converter-block/converter-block.component';
import { ConverterGraphComponent } from './routes/converter/components/converter-graph/converter-graph.component';
import { SharedModule } from '../shared/shared.module';
import { RatesComponent } from './routes/rates/rates.component';


@NgModule({
  declarations: [
    CoreComponent,
    ConverterComponent,
    NavbarComponent,
    FooterComponent,
    ConverterBlockComponent,
    ConverterGraphComponent,
    RatesComponent
  ],
  imports: [
    SharedModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }
